import bcrypt from 'bcryptjs';
import { getDb } from './_lib/db.js';
import { signAuthToken } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await usersCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const now = new Date();

    const insertResult = await usersCollection.insertOne({
      name: String(name).trim(),
      email: normalizedEmail,
      profile_photo: null,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now,
    });

    const user = {
      id: insertResult.insertedId.toString(),
      name: String(name).trim(),
      email: normalizedEmail,
      profile_photo: null,
    };

    const token = signAuthToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
