import { TeacherSubjectBatch, Teacher, Batch, Student } from '../models/index.js';
import { Op } from 'sequelize';

export const checkTeacherBatchPermissions = async (req, res, next) => {
  try {
    // Only apply to teacher role
    if (req.user.role !== 'teacher') {
      return next();
    }

    // Find the teacher
    const teacher = await Teacher.findOne({
      where: { userId: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    // Get the batch ID or student roll number from the request
    const batchId = req.params.batchId || req.body.batchId;
    const studentRollNo = req.params.studentRollNo || req.body.studentRollNo;

    if (!batchId && !studentRollNo) {
      return next();
    }

    // If we have a batch ID, check direct batch assignment
    if (batchId) {
      const teacherBatchAssignment = await TeacherSubjectBatch.findOne({
        where: {
          teacherId: teacher.id,
          batchId: batchId,
          isActive: true
        }
      });

      if (!teacherBatchAssignment) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this batch'
        });
      }

      req.teacherBatchAssignment = teacherBatchAssignment;
      return next();
    }

    // If we have a student roll number, check if the student belongs to any of the teacher's batches
    if (studentRollNo) {
      // First, find the student to get their roll number
      const student = await Student.findOne({
        where: { rollNumber: studentRollNo }
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Find all batches assigned to this teacher
      const teacherBatches = await TeacherSubjectBatch.findAll({
        where: { 
          teacherId: teacher.id,
          isActive: true
        },
        include: [{
          model: Batch,
          as: 'assignedBatch',
          required: true
        }]
      });

      // Check if the student's roll number falls within any of the teacher's batch ranges
      const hasPermission = teacherBatches.some(tsb => {
        const batch = tsb.assignedBatch;
        return batch && 
               studentRollNo >= batch.rollNumberStart && 
               studentRollNo <= batch.rollNumberEnd;
      });

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this student\'s assessments'
        });
      }

      // Store the first matching batch assignment for later use
      req.teacherBatchAssignment = teacherBatches[0];
      return next();
    }

    next();
  } catch (error) {
    console.error('Error checking teacher batch permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 