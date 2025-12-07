const express = require('express');
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

// Helper to format user for response
const formatUser = (user) => {
  if (!user) return null;
  const { _id, ...rest } = user;
  // Make sure to not send the password hash
  delete rest.password; 
  return { id: _id.toString(), ...rest };
};

// GET all users
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find({}).toArray();
    res.json(users.map(formatUser));
    console.log(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new user
router.post('/',  async (req, res) => {
  const { name, email, role, status } = req.body;
  try {
    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt); // Default password

    const newUser = {
      name,
      email,
      role,
      status,
      password,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    const insertedUser = await db.collection('users').findOne({ _id: result.insertedId });

    res.status(201).json(formatUser(insertedUser));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (update) a user
router.put('/:id',  async (req, res) => {
  const { name, email, role, status } = req.body;
  try {
    const db = getDB();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, email, role, status } },
      { returnDocument: 'after' }
    );
    res.json(formatUser(result));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
