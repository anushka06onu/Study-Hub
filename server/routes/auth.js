import express from 'express';
import { register, login, updateProfile, forgotPassword, resetPassword, verifyRegistration } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-registration', verifyRegistration);
router.post('/login', login);
router.put('/update-profile', auth, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

