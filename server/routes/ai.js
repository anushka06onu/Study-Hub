import express from 'express';
import { suggestTasks } from '../controllers/aiController.js';

const router = express.Router();

router.post('/suggest', suggestTasks);

export default router;
