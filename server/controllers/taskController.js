import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { mockDb } from '../utils/mockStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const listTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (isDbConnected()) {
      const query = userId ? { userId } : {};
      const items = await Task.find(query).sort({ createdAt: -1 });
      res.json(items);
    } else {
      console.warn('DB not connected, using Mock Store for listTasks');
      const items = mockDb.tasks.find();
      const filtered = userId ? items.filter(t => t.userId === userId) : items;
      res.json(filtered);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user?.id };
    if (isDbConnected()) {
      const created = await Task.create(data);
      res.status(201).json(created);
    } else {
      console.warn('DB not connected, using Mock Store for createTask');
      const created = mockDb.tasks.create(data);
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const updated = await Task.findOneAndUpdate(filter, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    } else {
      console.warn('DB not connected, using Mock Store for updateTask');
      const updated = mockDb.tasks.findByIdAndUpdate(id, req.body);
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const deleted = await Task.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    } else {
      console.warn('DB not connected, using Mock Store for deleteTask');
      const deleted = mockDb.tasks.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleComplete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const task = await Task.findOne(filter);
      if (!task) return res.status(404).json({ message: 'not found' });
      task.completed = !task.completed;
      await task.save();
      res.json(task);
    } else {
      console.warn('DB not connected, using Mock Store for toggleComplete');
      const task = mockDb.tasks.find().find(t => t._id === id);
      if (!task) return res.status(404).json({ message: 'not found' });
      task.completed = !task.completed;
      res.json(task);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

