
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

function getIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '';
}

export async function POST(req: NextRequest) {
  if (req.method && req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }


  const body = await req.json();
  const { code, deviceFingerprint, browserFingerprint, mode } = body;
  const ip = getIp(req);

  // Defensive: deviceFingerprint must be present
  if (!deviceFingerprint) {
    return NextResponse.json({ error: 'Missing device fingerprint' }, { status: 400 });
  }
  // Defensive: mode must be present and valid
  if (!mode || (mode !== 'signup' && mode !== 'signin')) {
    return NextResponse.json({ error: 'Missing or invalid mode (signup/signin)' }, { status: 400 });
  }

  // Exchange code for Discord access token
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID!);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET!);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI || 'https://www.boundless-saga.com/api/auth/discord/callback');
  params.append('scope', 'identify email');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('Discord token error:', tokenData);
    return NextResponse.json({ error: 'Failed to get Discord token', details: tokenData }, { status: 401 });
  }

  // Get user info from Discord
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const discordUser = await userRes.json();
  if (!userRes.ok) {
    console.error('Discord user error:', discordUser);
    return NextResponse.json({ error: 'Failed to get Discord user', details: discordUser }, { status: 401 });
  }

  // Check for existing user by discord_id, device, or IP
  // Build .or() filter dynamically
  const orFilters = [`discord_id.eq.${discordUser.id}`];
  if (deviceFingerprint) orFilters.push(`device_fingerprint.eq.${deviceFingerprint}`);
  if (ip) orFilters.push(`ip_addresses.cs.{${ip}}`);
  if (typeof browserFingerprint === 'object' && browserFingerprint !== null && !Array.isArray(browserFingerprint)) {
    orFilters.push(`browser_fingerprint.eq.${JSON.stringify(browserFingerprint)}`);
  }
  const { data: existingUsers, error: findError } = await supabase
    .from('users')
    .select('*')
    .or(orFilters.join(','));
  if (findError) {
    console.error('Supabase find user error:', findError);
    return NextResponse.json({ error: 'Database error', details: findError.message }, { status: 500 });
  }

  if (mode === 'signup') {
    if (existingUsers && existingUsers.length > 0) {
      console.warn('Duplicate user detected:', existingUsers);
      return NextResponse.json({ error: 'Account already exists for this device or IP.' }, { status: 409 });
    }
    // ...proceed to create user (existing code below)...
  }
  if (mode === 'signin') {
    if (!existingUsers || existingUsers.length === 0) {
      return NextResponse.json({ error: 'No account found for this device or Discord account. Please sign up first.' }, { status: 404 });
    }
    // User exists, treat as login: update last_login, log attempt, upsert device, etc.
    const user = existingUsers[0];
    // Device tracking
    const { error: deviceError } = await supabase.from('user_devices').upsert([
      {
        user_id: user.id,
        device_fingerprint: deviceFingerprint,
        ip_address: ip,
        user_agent: (typeof browserFingerprint === 'object' && browserFingerprint !== null && browserFingerprint.userAgent)
          ? String(browserFingerprint.userAgent)
          : (typeof browserFingerprint === 'string' ? browserFingerprint : null),
        last_seen: new Date().toISOString(),
        is_trusted: true,
      },
    ]);
    if (deviceError) {
      console.error('Supabase device upsert error:', deviceError);
    }
    // Log login attempt
    const { error: loginError } = await supabase.from('login_attempts').insert([
      {
        identifier: discordUser.id,
        ip_address: ip,
        success: true,
        device_fingerprint: deviceFingerprint,
        attempt_time: new Date().toISOString(),
      },
    ]);
    if (loginError) {
      console.error('Supabase login attempt error:', loginError);
    }
    // Update user's last_login and ip_addresses
    const { error: updateError } = await supabase.from('users').update({
      last_login: new Date().toISOString(),
      ip_addresses: user.ip_addresses ? [...new Set([...user.ip_addresses, ip])] : [ip],
    }).eq('id', user.id);
    if (updateError) {
      console.error('Supabase user update error:', updateError);
    }
    // Redirect to dashboard after successful login
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'));
  }

  // Create user
  // Log for debugging
  console.log('DEBUG: browserFingerprint type:', typeof browserFingerprint, 'value:', browserFingerprint);
  // Defensive: only allow object or null for jsonb
  let safeBrowserFingerprint = null;
  if (typeof browserFingerprint === 'object' && browserFingerprint !== null && !Array.isArray(browserFingerprint)) {
    safeBrowserFingerprint = browserFingerprint;
  }
  const { data: user, error: createError } = await supabase
    .from('users')
    .insert([
      {
        discord_id: discordUser.id,
        email: discordUser.email,
        username: discordUser.username,
        display_name: discordUser.global_name || discordUser.username,
        avatar_url: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : null,
        device_fingerprint: deviceFingerprint,
        ip_addresses: [ip],
        browser_fingerprint: safeBrowserFingerprint,
        email_verified: discordUser.verified,
        is_banned: false,
      },
    ])
    .select()
    .single();
  if (createError) {
    console.error('Supabase create user error:', createError);
    return NextResponse.json({ error: 'Failed to create user', details: createError.message }, { status: 500 });
  }

  // Device tracking
  const { error: deviceError } = await supabase.from('user_devices').upsert([
    {
      user_id: user.id,
      device_fingerprint: deviceFingerprint,
      ip_address: ip,
      user_agent: (typeof browserFingerprint === 'object' && browserFingerprint !== null && browserFingerprint.userAgent)
        ? String(browserFingerprint.userAgent)
        : (typeof browserFingerprint === 'string' ? browserFingerprint : null),
      last_seen: new Date().toISOString(),
      is_trusted: true,
    },
  ]);
  if (deviceError) {
    console.error('Supabase device upsert error:', deviceError);
  }

  // Log login attempt
  const { error: loginError } = await supabase.from('login_attempts').insert([
    {
      identifier: discordUser.id,
      ip_address: ip,
      success: true,
      device_fingerprint: deviceFingerprint,
      attempt_time: new Date().toISOString(),
    },
  ]);
  if (loginError) {
    console.error('Supabase login attempt error:', loginError);
  }

  // Update user's last_login and ip_addresses
  const { error: updateError } = await supabase.from('users').update({
    last_login: new Date().toISOString(),
    ip_addresses: user.ip_addresses ? [...new Set([...user.ip_addresses, ip])] : [ip],
  }).eq('id', user.id);
  if (updateError) {
    console.error('Supabase user update error:', updateError);
  }
  // Redirect to dashboard after successful login
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boundless-saga.com'));
}
