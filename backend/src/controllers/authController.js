const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
require('dotenv').config();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be 8+ chars with uppercase, lowercase, number, and special character',
      });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.two_factor_enabled) {
      return res.json({ requires2FA: true, userId: user.id });
    }

    res.json({ token: generateToken(user), user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findByPk(userId);

    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
    });

    if (!verified) return res.status(401).json({ message: 'Invalid 2FA code' });

    res.json({ token: generateToken(user), user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Setup 2FA
exports.setup2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `SecureVault (${req.user.email})` });
    await req.user.update({ two_factor_secret: secret.base32 });
    const qr = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ qr, secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Enable 2FA
exports.enable2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: req.user.two_factor_secret,
      encoding: 'base32',
      token,
    });
    if (!verified) return res.status(400).json({ message: 'Invalid token' });
    await req.user.update({ two_factor_enabled: true });
    res.json({ message: '2FA enabled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, email: req.user.email, role: req.user.role, two_factor_enabled: req.user.two_factor_enabled } });
};