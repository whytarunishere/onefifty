import { ObjectId } from 'mongodb';
import { getDb } from './_lib/db.js';
import { parseBearerToken, verifyAuthToken } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = parseBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyAuthToken(token);
    const db = await getDb();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(String(payload.sub)) },
      { projection: { name: 1, email: 1 } }
    );

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      detail: error instanceof Error ? error.message : 'Invalid token',
    });
  }
}
