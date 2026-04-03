import express from 'express';
import { listTasks, createTask, updateTask, deleteTask, toggleComplete } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.post('/:id/complete', toggleComplete);
router.delete('/:id', deleteTask);

export default router;
