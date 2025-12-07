require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const DB_NAME = 'admin-dashboard';

const users = [
    { _id: new ObjectId(), name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', lastLogin: '2023-10-26T10:00:00Z', createdAt: '2023-01-15T10:00:00Z' },
    { _id: new ObjectId(), name: 'Bob Williams', email: 'bob@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-25T12:30:00Z', createdAt: '2023-02-20T11:00:00Z' },
    { _id: new ObjectId(), name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2023-09-15T08:45:00Z', createdAt: '2023-03-10T09:00:00Z' },
    { _id: new ObjectId(), name: 'Diana Miller', email: 'diana@example.com', role: 'Editor', status: 'Active', lastLogin: '2023-10-26T11:00:00Z', createdAt: '2023-04-05T14:20:00Z' },
    { _id: new ObjectId(), name: 'Ethan Davis', email: 'ethan@example.com', role: 'Viewer', status: 'Active', lastLogin: '2023-10-24T15:20:00Z', createdAt: '2023-05-25T18:00:00Z' },
    { _id: new ObjectId(), name: 'Fiona Garcia', email: 'fiona@example.com', role: 'Editor', status: 'Inactive', lastLogin: '2023-08-30T18:00:00Z', createdAt: '2023-06-15T12:00:00Z' }
];

const posts = [
      { title: 'First Blog Post', authorId: users[0]._id.toString(), status: 'Published', createdAt: '2023-10-01T10:00:00Z', updatedAt: '2023-10-02T11:00:00Z' },
      { title: 'Getting Started with Angular', authorId: users[1]._id.toString(), status: 'Published', createdAt: '2023-10-05T14:30:00Z', updatedAt: '2023-10-05T14:30:00Z' },
      { title: 'Understanding Tailwind CSS', authorId: users[0]._id.toString(), status: 'Draft', createdAt: '2023-10-10T09:00:00Z', updatedAt: '2023-10-11T16:45:00Z' },
      { title: 'A Guide to D3.js', authorId: users[3]._id.toString(), status: 'Published', createdAt: '2023-10-12T18:00:00Z', updatedAt: '2023-10-12T18:00:00Z' },
];

const importData = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('posts').deleteMany({});
    console.log('Cleared existing data...');

    // Hash user passwords
    const salt = await bcrypt.genSalt(10);
    for (const user of users) {
        user.password = await bcrypt.hash('password123', salt);
    }
    
    // Insert new data
    await db.collection('users').insertMany(users);
    await db.collection('posts').insertMany(posts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();