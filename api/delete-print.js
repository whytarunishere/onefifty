import { getDb } from './_lib/db.js';
import { parseBearerToken, verifyAuthToken } from './_lib/auth.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

    const id = req.body && (req.body.id || req.body._id);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    let objectId;
    try {
      // Accept either string id or object like { $oid: '...' }
      const raw = typeof id === 'object' && id.$oid ? id.$oid : String(id);
      objectId = new ObjectId(raw);
    } catch (err) {
      return res.status(400).json({ error: 'invalid id' });
    }

    const existing = await collection.findOne({ _id: objectId });
    if (!existing) {
      return res.status(404).json({ error: 'Print not found' });
    }

    // Enforce ownership: only the author can delete their print
    if (String(existing.author_id) !== String(payload.sub)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await collection.deleteOne({ _id: objectId });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete Print Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
