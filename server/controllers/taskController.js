import Task from '../models/Task.js';

export const listTasks = async (req, res) => {
  try {
    const query = req.user?.id ? { userId: req.user.id } : {};
    const items = await Task.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const created = await Task.create({ ...req.body, userId: req.user?.id });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const updated = await Task.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const deleted = await Task.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleComplete = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const task = await Task.findOne(filter);
    if (!task) return res.status(404).json({ message: 'not found' });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
