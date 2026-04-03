import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const buildToken = (user) => {
  const payload = { id: user._id, email: user.email };
  const secret = process.env.JWT_SECRET || 'studyhub-dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'user exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    const token = buildToken(user);
    res.status(201).json({ message: 'Registration Successful', user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'invalid credentials' });
    const token = buildToken(user);
    res.json({ message: 'Login Successful', user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const current = (_req, res) => {
  res.status(501).json({ message: 'not implemented' });
};
