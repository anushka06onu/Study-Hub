import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockDb } from '../utils/mockStore.js';

const buildToken = (user) => {
  const payload = { id: user._id, email: user.email };
  const secret = process.env.JWT_SECRET || 'studyhub-dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const isDbConnected = () => mongoose.connection.readyState === 1;

// Seed demo user for testing
(async () => {
  const email = 'test@example.com';
  const pass = '$2a$10$CEtkWgVuNz7CySR1u3GJzesTMqD6oxJNThMA1gLSKMl/MAGy/jviS'; // 'password123'
  if (!isDbConnected()) {
    const exists = mockDb.users.findOne({ email });
    if (!exists) mockDb.users.create({ email, password: pass, name: 'Demo User' });
  }
})();

let pendingUsers = {}; // Store unverified registration data

export const sendRegistrationOTP = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  pendingUsers[email] = { password, name, otp, createdAt: Date.now() };
  
  console.log('\n' + '='.repeat(50));
  console.log(`[AUTH] REGISTRATION OTP FOR ${email}: ${otp}`);
  console.log('='.repeat(50) + '\n');
  res.json({ message: 'OTP sent to your email for registration' });
};

export const verifyRegistration = async (req, res) => {
  const { email, otp } = req.body;
  const pending = pendingUsers[email];
  
  if (!pending) return res.status(400).json({ message: 'No registration pending for this email' });
  if (pending.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  
  try {
    const { password, name } = pending;
    let user;
    if (isDbConnected()) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: 'user exists' });
      const hash = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hash, name });
    } else {
      const exists = mockDb.users.findOne({ email });
      if (exists) return res.status(409).json({ message: 'user exists' });
      const hash = await bcrypt.hash(password, 10);
      user = mockDb.users.create({ email, password: hash, name });
    }

    delete pendingUsers[email];
    const token = buildToken(user);
    res.status(201).json({ message: 'Registration Successful', user: { id: user._id, email: user.email, name: user.name }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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

let otps = {}; // Mock OTP store

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = otp;
  console.log('\n' + '*'.repeat(50));
  console.log(`[AUTH] FORGOT PASSWORD OTP FOR ${email}: ${otp}`);
  console.log('*'.repeat(50) + '\n');
  res.json({ message: 'OTP sent to your email' });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (otps[email] !== otp) return res.status(400).json({ message: 'Invalid OTP' });
  
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    if (isDbConnected()) {
      await User.findOneAndUpdate({ email }, { password: hash });
    } else {
      const user = mockDb.users.findOne({ email });
      if (user) user.password = hash;
    }
    delete otps[email];
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

