import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { mockDb } from '../utils/mockStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const listProjects = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (isDbConnected()) {
      const query = userId ? { userId } : {};
      const items = await Project.find(query).sort({ createdAt: -1 });
      res.json(items);
    } else {
      console.warn('DB not connected, using Mock Store for listProjects');
      const items = mockDb.projects.find();
      const filtered = userId ? items.filter(p => p.userId === userId) : items;
      res.json(filtered);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user?.id };
    if (isDbConnected()) {
      const created = await Project.create(data);
      res.status(201).json(created);
    } else {
      console.warn('DB not connected, using Mock Store for createProject');
      const created = mockDb.projects.create(data);
      res.status(201).json(created);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const updated = await Project.findOneAndUpdate(filter, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    } else {
      console.warn('DB not connected, using Mock Store for updateProject');
      const updated = mockDb.projects.findByIdAndUpdate(id, req.body);
      if (!updated) return res.status(404).json({ message: 'not found' });
      res.json(updated);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (isDbConnected()) {
      const filter = { _id: id };
      if (userId) filter.userId = userId;
      const deleted = await Project.findOneAndDelete(filter);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    } else {
      console.warn('DB not connected, using Mock Store for deleteProject');
      const deleted = mockDb.projects.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'not found' });
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

