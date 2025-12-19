import { getCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export async function findAllParticipants() {
  return getCollection('participants').find().toArray();
}

export async function findByOwner(ownerId) {
  return getCollection('participants').find({ ownerId }).toArray();
}

export async function createParticipant(doc) {
  const result = await getCollection('participants').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function deleteById(id) {
  return getCollection('participants').deleteOne({ _id: new ObjectId(id) });
}
