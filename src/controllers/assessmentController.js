import { Student, Assessment, Batch, TeacherSubjectBatch } from '../models/index.js';
import { Op } from 'sequelize';

// Save or update assessment data
export const saveAssessment = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const {
      studentRollNo, 
      experimentNo, 
      scheduledPerformanceDate, 
      actualPerformanceDate, 
      scheduledSubmissionDate, 
      actualSubmissionDate, 
      rppMarks, 
      spoMarks, 
      assignmentMarks, 
      id,
      finalAssignmentMarks,
      testMarks,
      theoryAttendanceMarks,
      finalMarks,
      unitTest1Marks,
      unitTest2Marks,
      unitTest3Marks,
      convertedUnitTestMarks
    } = req.body;

    console.log('Extracted studentRollNo:', studentRollNo);
    console.log('Extracted experimentNo:', experimentNo);

    // Validate required fields
    if (!studentRollNo || studentRollNo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Student roll number is required'
      });
    }

    if (experimentNo === undefined || experimentNo === null) {
      return res.status(400).json({
        success: false,
        message: 'Experiment number is required'
      });
    }

    // First check if the student exists
    const student = await Student.findOne({
      where: { rollNumber: studentRollNo },
      include: [{
        model: Batch,
        as: 'Batches'
      }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with the provided roll number'
      });
    }

    console.log('Found student:', student.toJSON());
    console.log('Teacher ID from request:', req.user.teacherId);
    console.log('Student batches:', student.Batches ? student.Batches.map(b => b.toJSON()) : []);

    // Then check if the student is in any batches that this teacher can access
    const teacherBatches = await TeacherSubjectBatch.findAll({
      where: { 
        teacherId: req.user.teacherId,
        isActive: true
      },
      include: [{
        model: Batch,
        as: 'assignedBatch',
        required: true
      }]
    });

    console.log('Teacher batches found:', teacherBatches.length);
    if (teacherBatches.length > 0) {
      console.log('Teacher batches:', teacherBatches.map(tsb => ({
        batchId: tsb.batchId,
        batchName: tsb.assignedBatch ? tsb.assignedBatch.name : 'unknown',
        studentRollNo
      })));
    }

    // Check if any of the teacher's batches contain this student
    const hasPermission = teacherBatches.some(tsb => {
      const batch = tsb.assignedBatch;
      return batch && 
             studentRollNo >= batch.rollNumberStart && 
             studentRollNo <= batch.rollNumberEnd;
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify assessments for this student'
      });
    }

    let assessment;
    
    if (id) {
      // Update existing assessment
      assessment = await Assessment.findByPk(id);
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }
      
      // Update fields
      const updateData = {
        experimentNo,
        scheduledPerformanceDate,
        actualPerformanceDate,
        scheduledSubmissionDate,
        actualSubmissionDate,
        rppMarks,
        spoMarks,
        assignmentMarks
      };
      
      if (finalAssignmentMarks !== undefined) updateData.finalAssignmentMarks = finalAssignmentMarks;
      if (testMarks !== undefined) updateData.testMarks = testMarks;
      if (theoryAttendanceMarks !== undefined) updateData.theoryAttendanceMarks = theoryAttendanceMarks;
      if (finalMarks !== undefined) updateData.finalMarks = finalMarks;
      if (unitTest1Marks !== undefined) updateData.unitTest1Marks = unitTest1Marks;
      if (unitTest2Marks !== undefined) updateData.unitTest2Marks = unitTest2Marks;
      if (unitTest3Marks !== undefined) updateData.unitTest3Marks = unitTest3Marks;
      if (convertedUnitTestMarks !== undefined) updateData.convertedUnitTestMarks = convertedUnitTestMarks;
      
      try {
        await assessment.update(updateData);
        console.log('Assessment updated:', assessment.toJSON());
      } catch (saveError) {
        console.error('Error saving assessment:', saveError);
        throw saveError;
      }
    } else {
      // Create new assessment
      try {
        assessment = await Assessment.create({
          studentRollNo,
          experimentNo,
          scheduledPerformanceDate,
          actualPerformanceDate,
          scheduledSubmissionDate,
          actualSubmissionDate,
          rppMarks,
          spoMarks,
          assignmentMarks,
          finalAssignmentMarks,
          testMarks,
          theoryAttendanceMarks,
          finalMarks,
          unitTest1Marks,
          unitTest2Marks,
          unitTest3Marks,
          convertedUnitTestMarks
        });
        console.log('Assessment created:', assessment.toJSON());
      } catch (createError) {
        console.error('Error creating assessment:', createError);
        throw createError;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      id: assessment.id,
      data: assessment
    });
  } catch (error) {
    console.error('Error in saveAssessment:', error);
    
    // Log more detailed error information
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:', error.errors.map(e => e.message));
    }
    
    if (error.parent) {
      console.error('Database error:', error.parent.message);
      
      if (error.parent.sql) {
        console.error('SQL Query:', error.parent.sql);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error saving assessment',
      error: error.message
    });
  }
};

// Get all assessments for a student
export const getStudentAssessments = async (req, res) => {
  try {
    const { studentRollNo } = req.params;
    
    console.log('Fetching assessments for student:', studentRollNo);
    
    const assessments = await Assessment.findAll({
      where: { studentRollNo },
      order: [['experimentNo', 'ASC']]
    });
    
    console.log('Found assessments:', assessments.length);
    
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

// Get all assessments for a batch
export const getBatchAssessments = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Get the batch to find roll number range
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Get all assessments for students in this batch
    const assessments = await Assessment.findAll({
      include: [{
        model: Student,
        where: {
          rollNumber: {
            [Op.between]: [batch.rollNumberStart, batch.rollNumberEnd]
          }
        },
        required: true
      }],
      order: [
        ['studentRollNo', 'ASC'],
        ['experimentNo', 'ASC']
      ]
    });
    
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch assessments',
      error: error.message
    });
  }
}; 