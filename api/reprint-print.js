import { ObjectId } from 'mongodb';
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
    const prints = db.collection('prints');

    const id = req.body && (req.body.id || req.body._id);
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
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

    await prints.updateOne(
      { _id: objectId },
      {
        $inc: { reprints: 1 },
        $set: {
          updated_at: new Date(),
          last_reprinted_by: String(payload.sub),
        },
      }
    );

    return res.status(200).json({
      success: true,
      reprints: Number(existing.reprints || 0) + 1,
    });
  } catch (error) {
    console.error('Reprint Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}