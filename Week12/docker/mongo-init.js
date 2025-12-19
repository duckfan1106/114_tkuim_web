db = db.getSiblingDB('week12');

// participants collection + ownerId index
db.createCollection('participants');
db.participants.createIndex({ ownerId: 1 });

// users collection + email unique index
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// INSERT an admin placeholder (hash should be generated with bcrypt and replaced)
// db.users.insertOne({
//   email: 'admin@example.com',
//   passwordHash: '<PASTE_BCRYPT_HASH_HERE>',
//   role: 'admin',
//   createdAt: new Date()
// });
