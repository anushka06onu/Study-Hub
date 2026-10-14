import { getSigningSecret } from '../utils/authSecurity.js';
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'no auth' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, getSigningSecret());
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'invalid' });
  }
}
