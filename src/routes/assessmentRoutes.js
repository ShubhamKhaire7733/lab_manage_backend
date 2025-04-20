import express from 'express';
import { saveAssessment, getStudentAssessments, getBatchAssessments } from '../controllers/assessmentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkTeacherBatchPermissions } from '../middleware/checkTeacherBatchPermissions.js';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

// Save or update assessment (with teacher batch permissions)
router.post('/', checkTeacherBatchPermissions, saveAssessment);

// Get all assessments for a student (with teacher batch permissions)
router.get('/student/:studentRollNo', checkTeacherBatchPermissions, getStudentAssessments);

// Get all assessments for a batch (with teacher batch permissions)
router.get('/batch/:batchId', checkTeacherBatchPermissions, getBatchAssessments);

export default router; 