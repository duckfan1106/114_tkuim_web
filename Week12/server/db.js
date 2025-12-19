import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToDatabase(uri) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB', db.databaseName);
  return db;
}

export function getCollection(name) {
  if (!db) throw new Error('Database not connected yet');
  return db.collection(name);
}

export async function closeDatabase() {
  if (client) await client.close();
}
