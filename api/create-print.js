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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('prints');

    if (!req.body || typeof req.body.headline !== 'string') {
      return res.status(400).json({ error: 'headline is required' });
    }

    // Prepare the document to insert
    const newPrint = {
      content: req.body.headline.trim(),
      author_name: "Anonymous Contributor", // Hardcoded until you add login
      is_verified: false,
      reprints: 0,
      viewpoints: 0,
      created_at: new Date(),
    };

    const result = await collection.insertOne(newPrint);
    
    return res.status(200).json({ success: true, printId: result.insertedId });
  } catch (error) {
    console.error("Database Error:", error);

    return res.status(500).json({
      error: 'Internal Server Error',
      detail: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}