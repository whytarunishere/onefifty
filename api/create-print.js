import { getDb } from './_lib/db.js';
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

    if (!req.body || typeof req.body.headline !== 'string') {
      return res.status(400).json({ error: 'headline is required' });
    }

    const userName = typeof payload.name === 'string' && payload.name.trim()
      ? payload.name
      : 'Anonymous Contributor';

    // Prepare the document to insert
    const newPrint = {
      content: req.body.headline.trim(),
      author_name: userName,
      author_id: String(payload.sub),
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