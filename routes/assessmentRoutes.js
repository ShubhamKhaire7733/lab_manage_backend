import express from 'express';
import { saveAssessment, getStudentAssessments, getBatchAssessments } from '../controllers/assessmentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with token verification
router.use(verifyToken);

// Save or update assessment
router.post('/', saveAssessment);

// Get all assessments for a student
router.get('/student/:studentRollNo', getStudentAssessments);

// Get all assessments for a batch
router.get('/batch/:batchId', getBatchAssessments);

export default router; 