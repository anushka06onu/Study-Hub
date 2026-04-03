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

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
// Protected routes (stubbed auth)
app.use('/api/subjects', auth, subjectRoutes);
app.use('/api/tasks', auth, taskRoutes);
app.use('/api/projects', auth, projectRoutes);
app.use('/api/sessions', auth, sessionRoutes);

app.get('/', (_req, res) => res.json({ status: 'StudyHub API ready' }));

const start = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/studyhub';
    await mongoose.connect(uri);
    console.log('Mongo connected');
  } catch (err) {
    console.warn('Mongo connection failed (scaffold mode):', err.message);
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API listening on ${port}`));
};

start();

export default app;
