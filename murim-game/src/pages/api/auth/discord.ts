import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/db';
import fetch from 'node-fetch';

function getIp(req: NextApiRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    ''
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, deviceFingerprint, browserFingerprint } = req.body;
  const ip = getIp(req);

  // Exchange code for Discord access token
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID!);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET!);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.NEXTAUTH_URL + '/api/auth/discord/callback');
  params.append('scope', 'identify email');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return res.status(401).json({ error: 'Failed to get Discord token', details: tokenData });
  }

  // Get user info from Discord
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const discordUser = await userRes.json();
  if (!userRes.ok) {
    return res.status(401).json({ error: 'Failed to get Discord user', details: discordUser });
  }

  // Check for existing user by discord_id, device, or IP
  const { data: existingUsers, error: findError } = await supabase
    .from('users')
    .select('id')
    .or(
      `discord_id.eq.${discordUser.id},device_fingerprint.eq.${deviceFingerprint},ip_addresses.cs.{${ip}},browser_fingerprint.eq.${JSON.stringify(browserFingerprint)}`
    );
  if (findError) {
    return res.status(500).json({ error: 'Database error', details: findError.message });
  }
  if (existingUsers && existingUsers.length > 0) {
    return res.status(409).json({ error: 'Account already exists for this device or IP.' });
  }

  // Create user
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
        browser_fingerprint: browserFingerprint,
        email_verified: discordUser.verified,
        is_banned: false,
      },
    ])
    .select()
    .single();
  if (createError) {
    return res.status(500).json({ error: 'Failed to create user', details: createError.message });
  }

  // Device tracking
  await supabase.from('user_devices').upsert([
    {
      user_id: user.id,
      device_fingerprint: deviceFingerprint,
      ip_address: ip,
      user_agent: browserFingerprint.userAgent,
      last_seen: new Date().toISOString(),
      is_trusted: true,
    },
  ]);

  // Log login attempt
  await supabase.from('login_attempts').insert([
    {
      identifier: discordUser.id,
      ip_address: ip,
      success: true,
      device_fingerprint: deviceFingerprint,
      attempt_time: new Date().toISOString(),
    },
  ]);

  // Update user's last_login and ip_addresses
  await supabase.from('users').update({
    last_login: new Date().toISOString(),
    ip_addresses: user.ip_addresses ? [...new Set([...user.ip_addresses, ip])] : [ip],
  }).eq('id', user.id);

  return res.status(200).json({ user: { id: user.id, email: user.email, username: user.username } });
}
