// server/middleware/googlePassport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { getDB } = require('../db'); // adjust if your db export is different

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDB();
        const users = db.collection('users');

        // Try find user by googleId or email
        let user = await users.findOne({ googleId: profile.id });

        if (!user) {
          user = await users.findOne({ email: profile.emails[0].value });
        }

        if (!user) {
          const newUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: 'admin', // or 'user' based on your logic
            createdAt: new Date(),
          };

          const result = await users.insertOne(newUser);
          user = result.ops ? result.ops[0] : newUser;
        }

        done(null, user);
      } catch (err) {
        console.error('Google strategy error:', err);
        done(err, null);
      }
    }
  )
);

module.exports = passport;
