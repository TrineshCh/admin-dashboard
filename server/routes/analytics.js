const express = require('express');
const { getDB } = require('../db');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   GET /api/analytics/metrics
// @desc    Get dashboard metrics
// @access  Private
router.get('/metrics',  async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection('users');
        const postsCollection = db.collection('posts');

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const totalUsers = await usersCollection.countDocuments();
        const newUsersLast7Days = await usersCollection.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const totalPosts = await postsCollection.countDocuments();
        const publishedPosts = await postsCollection.countDocuments({ status: 'Published' });
        
        // Change percentages are hardcoded for now, but could be calculated
        const metrics = [
          { title: 'Total Users', value: `${totalUsers}`, change: 1.2, icon: 'users' },
          { title: 'New Users (7 days)', value: `${newUsersLast7Days}`, change: 5.8, icon: 'user-plus' },
          { title: 'Total Posts', value: `${totalPosts}`, change: -0.5, icon: 'document-text' },
          { title: 'Published Posts', value: `${publishedPosts}`, change: 2.8, icon: 'check-circle' }
        ];

        res.json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/analytics/posts-by-month
// @desc    Get posts created per month
// @access  Private
router.get('/posts-by-month',  async (req, res) => {
    try {
        const db = getDB();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const pipeline = [
            { $match: { createdAt: { $gte: oneYearAgo.toISOString() } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$createdAt" } } },
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } },
            { $project: { label: "$_id", value: "$count", _id: 0 } }
        ];
        
        const posts = await db.collection('posts').aggregate(pipeline).toArray();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/analytics/signups-by-day
// @desc    Get signups data for last 30 days
// @access  Private
router.get('/signups-by-day',  async (req, res) => {
    try {
        const db = getDB();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const pipeline = [
            { $match: { createdAt: { $gte: thirtyDaysAgo.toISOString() } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } },
            { $project: { label: "$_id", value: "$count", _id: 0 } }
        ];
        
        const signups = await db.collection('users').aggregate(pipeline).toArray();

        // Fill in missing dates with 0 counts
        const resultsMap = new Map(signups.map(s => [s.label, s.value]));
        const fullResults = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
            const dateString = d.toISOString().split('T')[0];
            fullResults.push({
                label: dateString.substring(5), // "MM-DD"
                value: resultsMap.get(dateString) || 0
            });
        }

        res.json(fullResults);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/analytics/roles
// @desc    Get user role distribution
// @access  Private
router.get('/roles',  async (req, res) => {
    try {
        const db = getDB();
        const pipeline = [
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $project: { label: "$_id", value: "$count", _id: 0 } }
        ];
        const roleDistribution = await db.collection('users').aggregate(pipeline).toArray();
        res.json(roleDistribution);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/analytics/recent-users
// @desc    Get the 5 most recently registered users
// @access  Private
router.get('/recent-users',  async (req, res) => {
    try {
        const db = getDB();
        const recentUsers = await db.collection('users')
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .project({ name: 1, email: 1, createdAt: 1, _id: 0 })
            .toArray();
        res.json(recentUsers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;