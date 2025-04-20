import Student from '../models/Student.js';
import Assignment from '../models/Assignment.js';
import Batch from '../models/Batch.js';
import Assessment from '../models/Assessment.js';
import Attendance from '../models/Attendance.js';
import { Op } from 'sequelize';
import User from '../models/User.js';
import Performance from '../models/Performance.js';

export const getStudentStats = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{
        model: Assignment,
        as: 'assignments'
      }]
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const stats = {
      totalAssignments: student.assignments.length,
      completedAssignments: student.assignments.filter(a => a.status === 'Completed').length,
      totalMarks: student.assignments.reduce((sum, a) => sum + (a.assignmentMarks || 0), 0),
      maxMarks: student.assignments.length * 10,
      attendanceMarks: student.attendanceMarks,
      maxAttendanceMarks: 20
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ message: 'Error fetching student stats' });
  }
};

export const updateStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await student.update({
      attendanceMarks: req.body.attendanceMarks
    });
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance marks' });
  }
};

// Get current student's profile
export const getCurrentStudent = async (req, res) => {
  try {
    console.log('Getting current student profile for user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user.id;

    // Find student by userId
    const student = await Student.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get student's batch
    const batch = await Batch.findOne({
      where: {
        year: student.year,
        division: student.division
      }
    });

    // Get student's assessments
    const assessments = await Assessment.findAll({
      where: { studentRollNo: student.rollNumber },
      order: [['experimentNo', 'ASC']]
    });

    // Get student's attendance
    const attendance = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });

    // Get student's performance
    const performance = await Performance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });

    // Return student data with related information
    res.json({
      success: true,
      data: {
        ...student.toJSON(),
        batch: batch ? batch.toJSON() : null,
        assessments: assessments.map(a => a.toJSON()),
        attendance: attendance.map(a => a.toJSON()),
        performance: performance.map(p => p.toJSON())
      }
    });
  } catch (error) {
    console.error('Error getting current student:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting current student',
      error: error.message
    });
  }
};

// Get student's batch details
export const getStudentBatch = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Batch,
        attributes: ['id', 'name', 'year', 'division', 'day', 'time']
      }]
    });

    if (!student || !student.Batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(student.Batch);
  } catch (error) {
    console.error('Error fetching student batch:', error);
    res.status(500).json({ message: 'Error fetching student batch' });
  }
};

// Get student's assessments
export const getStudentAssessments = async (req, res) => {
  try {
    if (!req.user.rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Student roll number not found in token'
      });
    }

    const assessments = await Assessment.findAll({
      where: {
        studentRollNo: req.user.rollNumber,
        experimentNo: { [Op.gt]: 0 } // Exclude final assessment (experimentNo = 0)
      },
      order: [['experimentNo', 'ASC']],
      attributes: [
        'id',
        'experimentNo',
        'scheduledPerformanceDate',
        'actualPerformanceDate',
        'scheduledSubmissionDate',
        'actualSubmissionDate',
        'rppMarks',
        'spoMarks',
        'assignmentMarks'
      ]
    });

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student assessments',
      error: error.message
    });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    if (!req.user.rollNumber) {
      return res.status(400).json({ message: 'Student roll number not found in token' });
    }

    const attendanceRecords = await Attendance.findAll({
      where: {
        studentRollNo: req.user.rollNumber
      },
      order: [['date', 'DESC']]
    });

    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(record => record.status === 'present').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    res.json({
      records: attendanceRecords,
      total,
      present,
      percentage: Math.round(percentage)
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Error fetching student attendance' });
  }
};

// Get student's performance summary
export const getStudentPerformance = async (req, res) => {
  try {
    if (!req.user.rollNumber) {
      return res.status(400).json({ message: 'Student roll number not found in token' });
    }

    const assessments = await Assessment.findAll({
      where: {
        studentRollNo: req.user.rollNumber,
        experimentNo: {
          [Op.ne]: 0 // Exclude final assessment
        }
      }
    });

    // Calculate averages
    const totalAssessments = assessments.length;
    const averageRPP = totalAssessments > 0
      ? assessments.reduce((sum, assessment) => sum + (assessment.rppMarks || 0), 0) / totalAssessments
      : 0;
    const averageSPO = totalAssessments > 0
      ? assessments.reduce((sum, assessment) => sum + (assessment.spoMarks || 0), 0) / totalAssessments
      : 0;
    const averageAssignment = totalAssessments > 0
      ? assessments.reduce((sum, assessment) => sum + (assessment.assignmentMarks || 0), 0) / totalAssessments
      : 0;

    // Get unit test marks from final assessment
    const finalAssessment = await Assessment.findOne({
      where: {
        studentRollNo: req.user.rollNumber,
        experimentNo: 0
      }
    });

    res.json({
      averageRPP: Math.round(averageRPP * 100) / 100,
      averageSPO: Math.round(averageSPO * 100) / 100,
      averageAssignment: Math.round(averageAssignment * 100) / 100,
      unitTest1: finalAssessment?.unitTest1Marks || 0,
      unitTest2: finalAssessment?.unitTest2Marks || 0,
      unitTest3: finalAssessment?.unitTest3Marks || 0
    });
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({ message: 'Error fetching student performance' });
  }
};

// Get student dashboard data
export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({
      where: { userId },
      attributes: ['id', 'rollNumber', 'name', 'email', 'department', 'year', 'division', 'attendanceMarks'],
      include: [{
        model: Assessment,
        as: 'assessments',
        attributes: ['id', 'experimentNo', 'assignmentMarks', 'unitTest1Marks', 'unitTest2Marks', 'unitTest3Marks'],
        where: {
          experimentNo: 0 // Get the final assessment which contains unit test marks
        },
        required: false // Make it a LEFT JOIN to handle cases where there's no final assessment
      }]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get all assessments for summary calculation
    const allAssessments = await Assessment.findAll({
      where: { studentRollNo: student.rollNumber },
      attributes: ['id', 'experimentNo', 'assignmentMarks']
    });

    // Calculate summary statistics
    const totalAssessments = allAssessments.length;
    const completedAssessments = allAssessments.filter(a => a.assignmentMarks !== null).length;

    // Get unit test marks from the final assessment
    const finalAssessment = student.assessments && student.assessments.length > 0 ? student.assessments[0] : null;
    const unitTest1 = finalAssessment?.unitTest1Marks || 0;
    const unitTest2 = finalAssessment?.unitTest2Marks || 0;
    const unitTest3 = finalAssessment?.unitTest3Marks || 0;

    const response = {
      profile: {
        id: student.id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        division: student.division,
        attendanceMarks: student.attendanceMarks
      },
      summary: {
        totalAssessments,
        completedAssessments,
        totalAttendance: student.attendanceMarks || 0
      },
      unitTests: {
        unitTest1,
        unitTest2,
        unitTest3
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Error in getStudentDashboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};