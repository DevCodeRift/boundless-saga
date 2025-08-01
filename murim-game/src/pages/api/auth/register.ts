import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/db';

// Utility to get IP address from request
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

  const { email, password, deviceFingerprint, browserFingerprint } = req.body;
  const ip = getIp(req);

  // Check for existing user with same email, device, or IP
  const { data: existingUsers, error: findError } = await supabase
    .from('users')
    .select('id')
    .or(
      `email.eq.${email},device_fingerprint.eq.${deviceFingerprint},ip_addresses.cs.{${ip}},browser_fingerprint.eq.${browserFingerprint}`
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
        email,
        username: email.split('@')[0],
        device_fingerprint: deviceFingerprint,
        ip_addresses: [ip],
        browser_fingerprint: browserFingerprint,
        email_verified: false,
        is_banned: false,
      },
    ])
    .select()
    .single();

  if (createError) {
    return res.status(500).json({ error: 'Failed to create user', details: createError.message });
  }

  // Optionally: create user_devices entry here

  return res.status(201).json({ user });
}
