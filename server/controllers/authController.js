import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import { getSigningSecret, validateResetRequest } from '../utils/authSecurity.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockDb } from '../utils/mockStore.js';

const buildToken = (user) => {
  const payload = { id: user._id, email: user.email };
  const secret = getSigningSecret();
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const isDbConnected = () => mongoose.connection.readyState === 1;

// Seed demo user for testing
(async () => {
  const email = 'test@example.com';
  const pass = '$2a$10$CEtkWgVuNz7CySR1u3GJzesTMqD6oxJNThMA1gLSKMl/MAGy/jviS'; // 'password123'
  if (process.env.NODE_ENV !== 'production' && !isDbConnected()) {
    const exists = mockDb.users.findOne({ email });
    if (!exists) mockDb.users.create({ email, password: pass, name: 'Demo User' });
  }
})();

const pendingUsers = new Map(); // Development only: no email delivery exists yet.

export const sendRegistrationOTP = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(503).json({ message: 'Registration is unavailable until email verification delivery is configured.' });
  const { email, password, name } = req.body;
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) return res.status(400).json({ message: 'Valid email and an 8 to 72 byte password are required.' });
  const normalizedEmail = email.trim().toLowerCase();
  for (const [key, value] of pendingUsers) if (value.expiresAt <= Date.now()) pendingUsers.delete(key);
  if (pendingUsers.size >= 1000 && !pendingUsers.has(normalizedEmail)) return res.status(429).json({ message: 'Too many pending requests. Try later.' });
  const otp = String(randomInt(100000, 1000000));
  pendingUsers.set(normalizedEmail, { password: await bcrypt.hash(password, 10), name, code: otp, expiresAt: Date.now() + 300000, attempts: 0 });
  console.log(`[DEVELOPMENT ONLY] Registration OTP for ${normalizedEmail}: ${otp}`);
  res.json({ message: 'Development OTP generated in the server console. No email was sent.' });
};

export const verifyRegistration = async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(503).json({ message: 'Registration is unavailable until email verification delivery is configured.' });
  const { email, otp } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const pending = pendingUsers.get(normalizedEmail);
  if (!pending || pending.expiresAt <= Date.now() || pending.attempts >= 5 || pending.code !== otp) {
    if (pending) { pending.attempts++; if (pending.attempts >= 5 || pending.expiresAt <= Date.now()) pendingUsers.delete(normalizedEmail); }
    return res.status(400).json({ message: 'Invalid or expired registration request.' });
  }
  pendingUsers.delete(normalizedEmail);
  try {
    const exists = isDbConnected() ? await User.findOne({ email: normalizedEmail }) : mockDb.users.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: 'User exists' });
    const data = { email: normalizedEmail, password: pending.password, name: pending.name };
    const user = isDbConnected() ? await User.create(data) : mockDb.users.create(data);
    res.status(201).json({ message: 'Registration Successful', user: { id: user._id, email: user.email, name: user.name }, token: buildToken(user) });
  } catch { res.status(400).json({ message: 'Registration failed.' }); }
};

export const register = async (req, res) => {
  // Legacy register endpoint - redirected to sendRegistrationOTP if needed
  return sendRegistrationOTP(req, res);
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      console.warn('DB not connected, using Mock Store for Login');
      user = mockDb.users.findOne({ email });
    }

    if (!user) return res.status(404).json({ message: 'not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });

    const token = buildToken(user);
    res.json({ message: 'Login Successful', user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    let user;
    if (isDbConnected()) {
      user = await User.findById(userId);
    } else {
      user = mockDb.users.find().find(u => u._id === userId);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ message: 'Incorrect current password' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (name) user.name = name;

    if (isDbConnected()) {
      await user.save();
    } else {
      const idx = mockDb.users.find().findIndex(u => u._id === userId);
      mockDb.users.find()[idx] = user;
    }

    res.json({ message: 'Profile updated', user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const otps = new Map(); // Development-only, expiring OTP store

export const forgotPassword = async (req, res) => {
  // This repository has no email delivery integration for recovery.
  if (process.env.NODE_ENV === 'production') {
    return res.status(503).json({ message: 'Password recovery is unavailable until email delivery is configured.' });
  }
  const { email } = req.body;
  if (typeof email !== 'string' || !email.trim()) return res.status(400).json({ message: 'Email required' });
  const normalizedEmail = email.trim().toLowerCase();
  const otp = String(randomInt(100000, 1000000));
  otps.set(normalizedEmail, { code: otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0 });
  console.log(`[DEVELOPMENT ONLY] Password recovery OTP for ${normalizedEmail}: ${otp}`);
  res.json({ message: 'Development OTP generated. Email delivery is not configured.' });
};

export const resetPassword = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(503).json({ message: 'Password recovery is unavailable until email delivery is configured.' });
  }
  const { email, otp, newPassword } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const record = otps.get(normalizedEmail);
  if (!validateResetRequest(record, { email: normalizedEmail, otp, newPassword })) {
    if (record) {
      record.attempts += 1;
      if (record.attempts >= 5 || record.expiresAt <= Date.now()) otps.delete(normalizedEmail);
    }
    return res.status(400).json({ message: 'Invalid or expired recovery request; password must contain at least 8 characters.' });
  }
  // Consume before asynchronous work so the code cannot be reused concurrently.
  otps.delete(normalizedEmail);
  
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    if (isDbConnected()) {
      await User.findOneAndUpdate({ email: normalizedEmail }, { password: hash });
    } else {
      const user = mockDb.users.findOne({ email: normalizedEmail });
      if (user) user.password = hash;
    }
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


