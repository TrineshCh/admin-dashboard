const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://TrineshCh:Trinesh%233699@cluster0.uhepc.mongodb.net/?appName=Cluster0";
const DB_NAME = 'admin-dashboard';
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`MongoDB Connected to database: ${DB_NAME}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('DB not initialized');
  }
  return db;
};

module.exports = { connectDB, getDB };