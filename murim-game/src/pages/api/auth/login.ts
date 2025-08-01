import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/db';

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

  const { email, deviceFingerprint, browserFingerprint } = req.body;
  const ip = getIp(req);

  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // TODO: Add password hash check here

  // Device tracking: upsert into user_devices
  await supabase.from('user_devices').upsert([
    {
      user_id: user.id,
      device_fingerprint: deviceFingerprint,
      ip_address: ip,
      user_agent: browserFingerprint.userAgent,
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
  return res.status(200).json({ user: { id: user.id, email: user.email, username: user.username } });
}
