import express from 'express';
import { createBatch, getBatches, updateBatch, deleteBatch } from '../controllers/batchController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all batches
router.get('/', authenticateToken, getBatches);

// Create new batch (admin only)
router.post('/', authenticateToken, authorizeAdmin, createBatch);

// Update batch (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, updateBatch);

// Delete batch (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBatch);

export default router; 