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
    const viewpoints = db.collection('viewpoints');
    const users = db.collection('users');

    const printId = req.body && typeof req.body.printId === 'string' ? req.body.printId.trim() : '';
    const content = req.body && typeof req.body.content === 'string' ? req.body.content.trim() : '';

    if (!printId) {
      return res.status(400).json({ error: 'printId is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'content too long' });
    }

    let objectId;
    try {
      objectId = new ObjectId(printId);
    } catch (error) {
      return res.status(400).json({ error: 'invalid printId' });
    }

    const print = await prints.findOne({ _id: objectId });
    if (!print) {
      return res.status(404).json({ error: 'Print not found' });
    }

    const userName = typeof payload.name === 'string' && payload.name.trim()
      ? payload.name
      : 'Anonymous Contributor';

    const authorUser = await users.findOne(
      { _id: new ObjectId(String(payload.sub)) },
      { projection: { profile_photo: 1 } }
    );

    const viewpoint = {
      print_id: objectId.toString(),
      author_name: userName,
      author_id: String(payload.sub),
      author_profile_photo: authorUser?.profile_photo || null,
      is_verified: false,
      content,
      created_at: new Date(),
    };

    const result = await viewpoints.insertOne(viewpoint);
    await prints.updateOne({ _id: objectId }, { $inc: { viewpoints: 1 } });

    return res.status(200).json({
      success: true,
      viewpoint: { ...viewpoint, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Create Viewpoint Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}