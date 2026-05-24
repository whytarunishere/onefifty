import bcrypt from 'bcryptjs';
import { getDb } from './_lib/db.js';
import { signAuthToken } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const db = await getDb();
    const normalizedEmail = String(email).trim().toLowerCase();
    const foundUser = await db.collection('users').findOne({ email: normalizedEmail });

    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(String(password), foundUser.password_hash || '');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      id: foundUser._id.toString(),
      name: foundUser.name,
      email: foundUser.email,
    };

    const token = signAuthToken(user);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
