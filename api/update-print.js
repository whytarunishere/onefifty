import { ObjectId } from 'mongodb';
import { getDb } from './_lib/db.js';
import { parseBearerToken, verifyAuthToken } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = parseBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyAuthToken(token);
    const db = await getDb();
    const prints = db.collection('prints');

    const id = req.body && (req.body.id || req.body._id);
    const headline = req.body && typeof req.body.headline === 'string' ? req.body.headline.trim() : '';
    const content = req.body && typeof req.body.content === 'string' ? req.body.content.trim() : '';

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    if (!headline) {
      return res.status(400).json({ error: 'headline is required' });
    }

    if (headline.length > 100) {
      return res.status(400).json({ error: 'headline too long' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'content too long' });
    }

    let objectId;
    try {
      const raw = typeof id === 'object' && id.$oid ? id.$oid : String(id);
      objectId = new ObjectId(raw);
    } catch (error) {
      return res.status(400).json({ error: 'invalid id' });
    }

    const existing = await prints.findOne({ _id: objectId });
    if (!existing) {
      return res.status(404).json({ error: 'Print not found' });
    }

    if (String(existing.author_id) !== String(payload.sub)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedAt = new Date();
    await prints.updateOne(
      { _id: objectId },
      {
        $set: {
          headline,
          content,
          updated_at: updatedAt,
        },
      }
    );

    return res.status(200).json({
      success: true,
      print: {
        ...existing,
        headline,
        content,
        updated_at: updatedAt,
      },
    });
  } catch (error) {
    console.error('Update Print Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}