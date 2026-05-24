import { MongoClient } from 'mongodb';

// Cache the database connection in serverless environments
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db('onefifty_db'); // Name your database here
  return cachedDb;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('prints');

    const prints = await collection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return res.status(200).json(prints);
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}