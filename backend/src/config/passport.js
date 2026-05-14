const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { oauth_id: profile.id, oauth_provider: 'github' } });
    if (!user) {
      user = await User.create({
        username: profile.username,
        email: profile.emails?.[0]?.value || `${profile.id}@github.com`,
        oauth_provider: 'github',
        oauth_id: profile.id,
      });
    }
    return done(null, { user, token: generateToken(user) });
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { oauth_id: profile.id, oauth_provider: 'google' } });
    if (!user) {
      user = await User.create({
        username: profile.displayName.replace(/\s/g, '_'),
        email: profile.emails?.[0]?.value,
        oauth_provider: 'google',
        oauth_id: profile.id,
      });
    }
    return done(null, { user, token: generateToken(user) });
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;