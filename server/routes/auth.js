// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { getDB } = require('../db');
// const rateLimit = require('express-rate-limit');
// const router = express.Router();

// const loginLimiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 10, // Limit each IP to 10 requests per window
// 	standardHeaders: true, 
// 	legacyHeaders: false, 
//   message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' },
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user & get token
// // @access  Public
// router.post('/login', loginLimiter, async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const db = getDB();
//     const user = await db.collection('users').findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
    
//     // Update last login
//     await db.collection('users').updateOne(
//         { _id: user._id },
//         { $set: { lastLogin: new Date().toISOString() } }
//     );

//     const payload = { id: user._id.toString(), role: user.role };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
//     // Don't send password back
//     delete user.password;
    
//     // Transform _id to id
//     user.id = user._id.toString();
//     delete user._id;

//     res.json({ token, user });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');
const rateLimit = require('express-rate-limit');
const passport = require('../middleware/googlePassport');

const router = express.Router();

router.use(passport.initialize());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      'Too many login attempts from this IP, please try again after 15 minutes',
  },
});

// -------------------------------------------------
// @route   POST /api/auth/login
// @desc    Authenticate user & get token (normal login)
// @access  Public
// -------------------------------------------------
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    const lastLogin = new Date().toISOString();
    await db
      .collection('users')
      .updateOne({ _id: user._id }, { $set: { lastLogin } });

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Prepare user object for response
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin,
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// -------------------------------------------------
// @route   GET /api/auth/google
// @desc    Start Google OAuth login
// @access  Public
// -------------------------------------------------
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// -------------------------------------------------
// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback -> issue JWT
// @access  Public
// -------------------------------------------------
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.CLIENT_URL + '/login?error=google',
  }),
  async (req, res) => {
    try {
      const db = getDB();

      const lastLogin = new Date().toISOString();
      await db
        .collection('users')
        .updateOne({ _id: req.user._id }, { $set: { lastLogin } });

      const payload = {
        id: req.user._id.toString(),
        role: req.user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      // Redirect back to Angular with token in query param
      const redirectUrl = `${process.env.CLIENT_URL}/login/?token=${token}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google callback error:', err);
      return res.redirect(
        process.env.CLIENT_URL + '/login?error=google_internal'
      );
    }
  }
);

module.exports = router;
