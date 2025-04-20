import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher 
} from '../controllers/teacherController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { Teacher, User, Batch, TeacherSubjectBatch, Subject, Student } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get teacher's own profile - protected route, teacher only
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: teacher privileges required' });
    }

    const teacher = await Teacher.findOne({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['email', 'role']
      }]
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Parse the subjects field if it exists
    const teacherData = teacher.toJSON();
    if (teacherData.subjects) {
      try {
        teacherData.subjects = JSON.parse(teacherData.subjects);
      } catch (e) {
        // If parsing fails, ensure it's an array
        teacherData.subjects = Array.isArray(teacherData.subjects) ? teacherData.subjects : [];
      }
    } else {
      teacherData.subjects = [];
    }

    res.json(teacherData);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Error fetching teacher profile' });
  }
});

// Get teacher's batches - protected route, teacher only
router.get('/batches', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching batches for user:', req.user.id);
    
    if (req.user.role !== 'teacher') {
      return res.status(403).json([]);
    }

    // Find the teacher
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json([]);
    }

    console.log('Found teacher:', teacher.id);

    // Find all batches assigned to this teacher
    const teacherBatches = await TeacherSubjectBatch.findAll({
      where: { 
        teacherId: teacher.id,
        isActive: true
      },
      include: [
        {
          model: Batch,
          as: 'assignedBatch',
          attributes: ['id', 'name', 'year', 'division', 'day', 'time', 'rollNumberStart', 'rollNumberEnd', 'startDate', 'endDate']
        },
        {
          model: Subject,
          as: 'assignedSubject',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    console.log('Found teacher batches:', teacherBatches.length);

    // Format the response
    const formattedBatches = teacherBatches.map(allocation => {
      const batch = allocation.assignedBatch;
      const subject = allocation.assignedSubject;
      
      if (!batch) {
        console.log('Warning: Missing batch data for allocation:', allocation.id);
        return null;
      }

      return {
        id: batch.id,
        name: batch.name,
        year: batch.year,
        division: batch.division,
        day: batch.day,
        time: batch.time,
        rollNumberStart: batch.rollNumberStart,
        rollNumberEnd: batch.rollNumberEnd,
        startDate: batch.startDate,
        endDate: batch.endDate,
        subjectId: subject?.id,
        subjectName: subject?.name || 'Not specified',
        subjectCode: subject?.code || 'N/A',
        allocationId: allocation.id,
        academicYear: allocation.academicYear
      };
    }).filter(batch => batch !== null);

    console.log('Formatted batches:', formattedBatches.length);
    res.json(formattedBatches);
  } catch (error) {
    console.error('Error fetching teacher batches:', error);
    res.status(500).json([]);
  }
});

// Get batch details for a teacher - protected route, teacher only
router.get('/batches/:batchId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: teacher privileges required' });
    }

    const { batchId } = req.params;

    // Find the teacher
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Check if the teacher is assigned to this batch
    const allocation = await TeacherSubjectBatch.findOne({
      where: { 
        teacherId: teacher.id,
        batchId: batchId
      },
      include: [
        {
          model: Batch,
          as: 'assignedBatch',
          attributes: ['id', 'name', 'year', 'division', 'day', 'time', 'rollNumberStart', 'rollNumberEnd', 'startDate', 'endDate']
        },
        {
          model: Subject,
          as: 'assignedSubject',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!allocation) {
      return res.status(404).json({ message: 'Batch not found or not assigned to you' });
    }

    // Get students in this batch
    const students = await Student.findAll({
      where: {
        rollNumber: {
          [Op.between]: [allocation.assignedBatch.rollNumberStart, allocation.assignedBatch.rollNumberEnd]
        }
      },
      attributes: ['id', 'name', 'rollNumber', 'email']
    });

    // Format the response
    const batch = allocation.assignedBatch;
    const subject = allocation.assignedSubject;
    const formattedBatch = {
      id: batch.id,
      name: batch.name,
      year: batch.year,
      division: batch.division,
      day: batch.day,
      time: batch.time,
      rollNumberStart: batch.rollNumberStart,
      rollNumberEnd: batch.rollNumberEnd,
      startDate: batch.startDate,
      endDate: batch.endDate,
      subjectName: subject ? subject.name : 'Not specified',
      subjectCode: subject ? subject.code : null
    };

    res.json({
      batch: formattedBatch,
      students: students
    });
  } catch (error) {
    console.error('Error fetching batch details:', error);
    res.status(500).json({ message: 'Error fetching batch details' });
  }
});

// Get all teachers (for dropdown) - protected route
router.get('/all', authenticateToken, getAllTeachers);

// Get all teachers - protected route, admin only
router.get('/', authenticateToken, authorizeAdmin, getAllTeachers);

// Get teacher by ID - protected route, admin only
router.get('/:id', authenticateToken, authorizeAdmin, getTeacherById);

// Create new teacher - protected route, admin only
router.post('/', authenticateToken, authorizeAdmin, createTeacher);

// Update teacher - protected route, admin only
router.put('/:id', authenticateToken, authorizeAdmin, updateTeacher);

// Delete teacher - protected route, admin only
router.delete('/:id', authenticateToken, authorizeAdmin, deleteTeacher);

export default router; 