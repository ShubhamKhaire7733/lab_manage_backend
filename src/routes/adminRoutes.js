import express from 'express';
import {
  getAllStudentsWithMarks,
  getDashboardStats,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatches,
  getBatchById,
  markAttendance,
  getAttendanceReport,
  exportAttendanceData,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjects,
  allocateTeacher,
  updateTeacherAllocation,
  deleteTeacherAllocation,
  getTeacherAllocations,
  exportBatchData,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachers,
  getTeacherById,
  uploadData,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../controllers/adminController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { checkAdminPermissions } from '../middleware/checkAdminPermissions.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Apply authentication and admin authorization middleware to all routes
router.use(authenticateToken, authorizeAdmin, checkAdminPermissions);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/students/marks', getAllStudentsWithMarks);

// CSV Upload Routes
router.post('/upload/:type', upload.single('file'), uploadData);

// Teacher Management
router.post('/teachers', createTeacher);
router.get('/teachers', getTeachers);
router.get('/teachers/:id', getTeacherById);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Batch Management
router.post('/batches', createBatch);
router.get('/batches', getBatches);
router.get('/batches/:id', getBatchById);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);

// Subject Management
router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Teacher Allocation
router.post('/allocations', allocateTeacher);
router.get('/allocations', getTeacherAllocations);
router.put('/allocations/:id', updateTeacherAllocation);
router.delete('/allocations/:id', deleteTeacherAllocation);

// Attendance Management
router.post('/attendance', markAttendance);
router.get('/attendance/report', getAttendanceReport);
router.get('/attendance/export', exportAttendanceData);

// Data Export
router.get('/export/batch', exportBatchData);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router; 