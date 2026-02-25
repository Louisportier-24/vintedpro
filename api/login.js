export const config = { runtime: 'nodejs' };

import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

  const SUPABASE_URL = 'https://gsrktfbxxzhifamjopvi.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_I2HSx4aU_MDihQrq9kGmsg_hpMNDiE_';

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&password_hash=eq.${passwordHash}&is_active=eq.true&select=*`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
      }
    }
  );

  const users = await response.json();

  if (!users || users.length === 0) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const user = users[0];

  if (user.trial_end && new Date(user.trial_end) < new Date()) {
    return res.status(403).json({ error: "Période d'essai expirée" });
  }

  return res.status(200).json({
    name: user.name,
    email: user.email,
    notionDbName: user.notion_db_name,
    trialEnd: user.trial_end,
  });
}
