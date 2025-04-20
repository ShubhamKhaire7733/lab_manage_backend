import express from 'express';
import { auth } from '../middleware/auth.js';
import { getStudentAssignments, submitAssignment, updateAssignmentMarks } from '../controllers/assignmentController.js';

const router = express.Router();

router.get('/student/:studentId', auth, getStudentAssignments);
router.post('/:id/submit', auth, submitAssignment);
router.put('/:id/marks', auth, updateAssignmentMarks);

export default router;