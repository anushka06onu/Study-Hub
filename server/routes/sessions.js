import express from 'express';
import { listSessions, createSession, deleteSession, startSession, pauseSession, endSession } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', listSessions);
router.post('/', createSession);
router.post('/start', startSession);
router.post('/pause', pauseSession);
router.post('/end', endSession);
router.delete('/:id', deleteSession);

export default router;
