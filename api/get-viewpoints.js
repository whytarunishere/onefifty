import { ObjectId } from 'mongodb';
import { getDb } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const printId = typeof req.query?.printId === 'string' ? req.query.printId.trim() : '';
    if (!printId) {
      return res.status(400).json({ error: 'printId is required' });
    }

    const db = await getDb();
    const collection = db.collection('viewpoints');

    let objectId;
    try {
      objectId = new ObjectId(printId);
    } catch (error) {
      return res.status(400).json({ error: 'invalid printId' });
    }

    const viewpoints = await collection
      .find({ print_id: objectId.toString() })
      .sort({ created_at: 1 })
      .toArray();

    return res.status(200).json(viewpoints);
  } catch (error) {
    console.error('Get Viewpoints Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}