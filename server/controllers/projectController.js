import Project from '../models/Project.js';

export const listProjects = async (req, res) => {
  try {
    const query = req.user?.id ? { userId: req.user.id } : {};
    const items = await Project.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const created = await Project.create({ ...req.body, userId: req.user?.id });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const updated = await Project.findOneAndUpdate(filter, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const deleted = await Project.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
