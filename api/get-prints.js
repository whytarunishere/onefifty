import { getDb } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('prints');

    const prints = await collection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return res.status(200).json(prints);
  } catch (error) {
    console.error('Get Prints Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}