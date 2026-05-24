import { MongoClient } from 'mongodb';

// Cache the database connection in serverless environments
let cachedDb = null;
const DATABASE_NAME = 'onefifty_db';

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db(DATABASE_NAME);
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