const express = require('express');
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

// Helper to format post for response
const formatPost = (post) => {
  if (!post) return null;
  const { _id, ...rest } = post;
  return { id: _id.toString(), ...rest };
};


// GET all posts
router.get('/',  async (req, res) => {
  try {
    const db = getDB();
    const posts = await db.collection('posts').find({}).toArray();
    res.json(posts.map(formatPost));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new post
router.post('/',  async (req, res) => {
  const { title, authorId, status } = req.body;
  try {
    const db = getDB();
    const newPost = {
      title,
      authorId, // In a real app, you might validate this authorId exists
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('posts').insertOne(newPost);
    const insertedPost = await db.collection('posts').findOne({ _id: result.insertedId });
    res.status(201).json(formatPost(insertedPost));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (update) a post
router.put('/:id',  async (req, res) => {
  const { title, authorId, status } = req.body;
  try {
    const db = getDB();
    const result = await db.collection('posts').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, authorId, status, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    res.json(formatPost(result));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a post
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
