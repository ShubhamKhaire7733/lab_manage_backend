import express from 'express';
import { getCurrentStudent, getStudentBatch, getStudentAssessments, getStudentAttendance, getStudentPerformance, getStudentDashboard } from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { checkStudentPermissions } from '../middleware/checkStudentPermissions.js';

const router = express.Router();

// Apply authentication and permission middleware to all routes
router.use(authenticateToken, checkStudentPermissions);

// Get student dashboard
router.get('/dashboard', getStudentDashboard);

// Get current student profile
router.get('/me', getCurrentStudent);

// Get student's batch
router.get('/me/batch', getStudentBatch);

// Get student's assessments
router.get('/me/assessments', getStudentAssessments);

// Get student's attendance
router.get('/me/attendance', getStudentAttendance);

// Get student's performance
router.get('/me/performance', getStudentPerformance);

export default router;