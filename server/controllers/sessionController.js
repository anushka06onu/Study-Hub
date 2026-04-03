import Session from '../models/Session.js';

export const listSessions = async (req, res) => {
  try {
    const query = req.user?.id ? { userId: req.user.id } : {};
    const items = await Session.find(query).sort({ startTime: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const created = await Session.create({ ...req.body, userId: req.user?.id });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.id) filter.userId = req.user.id;
    const deleted = await Session.findOneAndDelete(filter);
    if (!deleted) return res.status(404).json({ message: 'not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const startSession = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!subjectId) return res.status(400).json({ message: 'subjectId required' });
    const created = await Session.create({ subjectId, userId: req.user?.id, startTime: new Date(), duration: 0 });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const pauseSession = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId required' });
    const filter = { _id: sessionId };
    if (req.user?.id) filter.userId = req.user.id;
    const updated = await Session.findOneAndUpdate(filter, { duration }, { new: true });
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json(updated);
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
    const filter = { _id: sessionId };
    if (req.user?.id) filter.userId = req.user.id;
    const updated = await Session.findOneAndUpdate(filter, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
