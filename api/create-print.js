import { getDb } from './_lib/db.js';
import { ObjectId } from 'mongodb';
import { parseBearerToken, verifyAuthToken } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = parseBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyAuthToken(token);
    const db = await getDb();
    const collection = db.collection('prints');
    const users = db.collection('users');

    // Validate body
    const headline = req.body && typeof req.body.headline === 'string' ? req.body.headline.trim() : '';
    const content = req.body && typeof req.body.content === 'string' ? req.body.content.trim() : '';

    if (!headline) {
      return res.status(400).json({ error: 'headline is required' });
    }

    // enforce limits
    if (headline.length > 100) {
      return res.status(400).json({ error: 'headline too long' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'content too long' });
    }

    const userName = typeof payload.name === 'string' && payload.name.trim()
      ? payload.name
      : 'Anonymous Contributor';

    const authorUser = await users.findOne(
      { _id: new ObjectId(String(payload.sub)) },
      { projection: { profile_photo: 1 } }
    );

    const newPrint = {
      headline,
      content,
      author_name: userName,
      author_id: String(payload.sub),
      author_profile_photo: authorUser?.profile_photo || null,
      is_verified: false,
      reprints: 0,
      viewpoints: 0,
      created_at: new Date(),
    };

    const result = await collection.insertOne(newPrint);
    
    return res.status(200).json({ success: true, printId: result.insertedId });
  } catch (error) {
    console.error('Create Print Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}