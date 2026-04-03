import express from 'express';
import { register, login, current } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', current);

export default router;
