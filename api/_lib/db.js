import { MongoClient } from 'mongodb';

let cachedDb = null;

const DATABASE_NAME = process.env.MONGODB_DB_NAME || 'onefifty_db';

export async function getDb() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db(DATABASE_NAME);
  return cachedDb;
}
