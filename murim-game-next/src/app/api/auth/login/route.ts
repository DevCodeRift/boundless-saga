
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

function getIp(req: NextRequest): string {
  // Next.js edge/serverless: try x-forwarded-for, then remote address
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  // fallback: not always available
  return '';
}

export async function POST(req: NextRequest) {
  if (req.method && req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await req.json();
  const { email, deviceFingerprint, browserFingerprint } = body;
  const ip = getIp(req);

  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // TODO: Add password hash check here

  // Device tracking: upsert into user_devices
  await supabase.from('user_devices').upsert([
    {
      user_id: user.id,
      device_fingerprint: deviceFingerprint,
      ip_address: ip,
      user_agent: browserFingerprint?.userAgent,
      last_seen: new Date().toISOString(),
    },
  ]);

  // Log login attempt
  await supabase.from('login_attempts').insert([
    {
      identifier: email,
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

  // Return user info (no sensitive data)
  return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username } });
}
