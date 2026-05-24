import { MongoClient } from 'mongodb';

// Cache the database connection in serverless environments
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db('userdb'); // Name your database here
  return cachedDb;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('prints');

    // Prepare the document to insert
    const newPrint = {
      content: req.body.headline, // This matches what you sent in Createpost.jsx
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}