import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import app from '../server/index.js';
import { connectToDatabase, getCollection } from '../server/db.js';
import bcrypt from 'bcrypt';

let mongod;
let uri;
let client;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  uri = mongod.getUri();
  await connectToDatabase(uri);
});

afterAll(async () => {
  if (mongod) await mongod.stop();
});

describe('auth & signup flows', () => {
  it('signup -> login -> token works', async () => {
    const agent = request(app);
    // signup
    const su = await agent.post('/auth/signup').send({ email: 'a@example.com', password: 'pass1234' });
    expect(su.status).toBe(201);

    const login = await agent.post('/auth/login').send({ email: 'a@example.com', password: 'pass1234' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    expect(login.body.user.email).toBe('a@example.com');
  });

  it('protects /api/signup endpoints and enforces owner/admin policy', async () => {
    const agent = request(app);
    // create student A and B
    await agent.post('/auth/signup').send({ email: 'owner@example.com', password: 'ownerpass' });
    await agent.post('/auth/signup').send({ email: 'other@example.com', password: 'otherpass' });

    const loginA = await agent.post('/auth/login').send({ email: 'owner@example.com', password: 'ownerpass' });
    const tokenA = loginA.body.token;

    // create participant as owner
    const create = await agent.post('/api/signup').set('Authorization', `Bearer ${tokenA}`).send({ name: 'P', email: 'p@example.com', phone: '0912' });
    expect(create.status).toBe(201);
    const id = create.body._id;

    // other user cannot delete
    const loginB = await agent.post('/auth/login').send({ email: 'other@example.com', password: 'otherpass' });
    const tokenB = loginB.body.token;
    const delByOther = await agent.delete(`/api/signup/${id}`).set('Authorization', `Bearer ${tokenB}`);
    expect(delByOther.status).toBe(403);

    // make an admin directly in DB
    const users = getCollection('users');
    const pwd = await bcrypt.hash('adminpass', 10);
    await users.insertOne({ email: 'admin@example.com', passwordHash: pwd, role: 'admin', createdAt: new Date() });
    const loginAdmin = await agent.post('/auth/login').send({ email: 'admin@example.com', password: 'adminpass' });
    const tokenAdmin = loginAdmin.body.token;
    const delByAdmin = await agent.delete(`/api/signup/${id}`).set('Authorization', `Bearer ${tokenAdmin}`);
    expect(delByAdmin.status).toBe(200);
  });
});
