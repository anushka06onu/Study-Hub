import express from 'express';
import { listSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController.js';

const router = express.Router();

router.get('/', listSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
