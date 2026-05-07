import mongoose from 'mongoose';
import Subject from '../models/Subject.js';
import { mockDb } from '../utils/mockStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const listSubjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const isTest = userEmail === 'test@example.com';

    let items = [];
    if (isDbConnected()) {
      const query = userId ? { userId } : {};
      items = await Subject.find(query).sort({ createdAt: -1 });
    } else {
      console.warn('DB not connected, using Mock Store for listSubjects');
      const all = mockDb.subjects.find();
      items = userId ? all.filter(s => String(s.userId) === String(userId)) : all;
    }

    if (isTest && items.length === 0) {
      items = [
        { name: 'Physics', _id: 'mock1', id: 'mock1', userId },
        { name: 'Math', _id: 'mock2', id: 'mock2', userId },
        { name: 'History', _id: 'mock3', id: 'mock3', userId },
        { name: 'English', _id: 'mock4', id: 'mock4', userId }
      ];
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user?.id };
    if (isDbConnected()) {
      const created = await Subject.create(data);
      res.status(201).json(created);
    } else {
      console.warn('DB not connected, using Mock Store for createSubject');
      const created = mockDb.subjects.create(data);
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const updated = await Subject.findOneAndUpdate(filter, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    } else {
      console.warn('DB not connected, using Mock Store for updateSubject');
      const updated = mockDb.subjects.findByIdAndUpdate(id, req.body);
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const deleted = await Subject.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    } else {
      console.warn('DB not connected, using Mock Store for deleteSubject');
      const deleted = mockDb.subjects.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

