import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import subjectRoutes from './routes/subjects.js';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import sessionRoutes from './routes/sessions.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import userRoutes from './routes/users.js';
import auth from './middleware/auth.js';
import { productionReady } from './utils/authSecurity.js';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const ready = productionReady(mongoose.connection.readyState);
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'unavailable' });
});
app.use('/api', (_req, res, next) => {
  if (!productionReady(mongoose.connection.readyState)) return res.status(503).json({ message: 'Service unavailable: configure JWT_SECRET and restore the production database.' });
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
// Protected routes (stubbed auth)
app.use('/api/subjects', auth, subjectRoutes);
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/projects', auth, projectRoutes);
app.use('/api/sessions', auth, sessionRoutes);

app.get('/', (_req, res) => { const ready = productionReady(mongoose.connection.readyState); res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'unavailable' }); });

const start = async () => {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) throw new Error('MONGO_URI is required');
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/studyhub';
    await mongoose.connect(uri);
    console.log('Mongo connected');
  } catch (err) {
    console.warn('Mongo connection failed (scaffold mode):', err.message);
  }
  const port = process.env.PORT || 5001;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`API listening on ${port}`));
  }
};

start();

export default app;

