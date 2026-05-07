import mongoose from 'mongoose';
import Session from '../models/Session.js';
import { mockDb } from '../utils/mockStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const listSessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const isTest = userEmail === 'test@example.com';

    let items = [];
    if (isDbConnected()) {
      const query = userId ? { userId } : {};
      items = await Session.find(query).sort({ startTime: -1 });
    } else {
      console.warn('DB not connected, using Mock Store for listSessions');
      const all = mockDb.sessions.find();
      items = userId ? all.filter(s => String(s.userId) === String(userId)) : all;
    }

    if (isTest && items.length === 0) {
      items = [
        { subjectId: 'mock1', userId, startTime: new Date(Date.now() - 86400000*2), duration: 120 },
        { subjectId: 'mock2', userId, startTime: new Date(Date.now() - 86400000*1), duration: 90 },
        { subjectId: 'mock3', userId, startTime: new Date(Date.now() - 86400000*3), duration: 45 },
        { subjectId: 'mock4', userId, startTime: new Date(Date.now() - 86400000*0), duration: 60 }
      ];
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user?.id };
    if (isDbConnected()) {
      const created = await Session.create(data);
      res.status(201).json(created);
    } else {
      console.warn('DB not connected, using Mock Store for createSession');
      const created = mockDb.sessions.create(data);
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const deleted = await Session.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    } else {
      console.warn('DB not connected, using Mock Store for deleteSession');
      const deleted = mockDb.sessions.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const startSession = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'subjectId required' });
    const data = { subjectId, userId: req.user?.id, startTime: new Date(), duration: 0 };
    if (isDbConnected()) {
      const created = await Session.create(data);
      res.status(201).json(created);
    } else {
      console.warn('DB not connected, using Mock Store for startSession');
      const created = mockDb.sessions.create(data);
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const pauseSession = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    if (isDbConnected()) {
      const filter = { _id: sessionId };
      if (req.user?.id) filter.userId = req.user.id;
      const updated = await Session.findOneAndUpdate(filter, { duration }, { new: true });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    } else {
      console.warn('DB not connected, using Mock Store for pauseSession');
      const updated = mockDb.sessions.findByIdAndUpdate(sessionId, { duration });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const endSession = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const endTime = new Date();
    const update = { endTime };
    if (typeof duration === 'number') update.duration = duration;
    if (isDbConnected()) {
      const filter = { _id: sessionId };
      if (req.user?.id) filter.userId = req.user.id;
      const updated = await Session.findOneAndUpdate(filter, update, { new: true });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    } else {
      console.warn('DB not connected, using Mock Store for endSession');
      const updated = mockDb.sessions.findByIdAndUpdate(sessionId, update);
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

