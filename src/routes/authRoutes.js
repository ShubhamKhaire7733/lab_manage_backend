import express from 'express';
import { login, register, verifyToken, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Verify token
router.get('/verify', verifyToken);

// Change password (requires authentication)
router.post('/change-password', authenticateToken, changePassword);

export default router;