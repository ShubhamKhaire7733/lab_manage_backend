import db from '../models/index.js';
const { Assessment, Student_SE } = db;

// Save or update assessment data
export const saveAssessment = async (req, res) => {
  try {
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
      finalMarks
    } = req.body;

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
      assessment.scheduledPerformanceDate = scheduledPerformanceDate;
      assessment.actualPerformanceDate = actualPerformanceDate;
      assessment.scheduledSubmissionDate = scheduledSubmissionDate;
      assessment.actualSubmissionDate = actualSubmissionDate;
      assessment.rppMarks = rppMarks;
      assessment.spoMarks = spoMarks;
      assessment.assignmentMarks = assignmentMarks;
      
      if (finalAssignmentMarks) assessment.finalAssignmentMarks = finalAssignmentMarks;
      if (testMarks) assessment.testMarks = testMarks;
      if (theoryAttendanceMarks) assessment.theoryAttendanceMarks = theoryAttendanceMarks;
      if (finalMarks) assessment.finalMarks = finalMarks;
      
      await assessment.save();
    } else {
      // Create new assessment
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
        finalMarks
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      id: assessment.id,
      data: assessment
    });
  } catch (error) {
    console.error('Error saving assessment:', error);
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
    
    const assessments = await Assessment.findAll({ 
      where: { studentRollNo },
      order: [['experimentNo', 'ASC']]
    });

    res.status(200).json({
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
    
    // First get all students in the batch - we'll need to adjust this based on the year
    // This is a placeholder - actual implementation would depend on your database structure
    const students = await Student_SE.findAll({ 
      where: { batch_id: batchId }
    });
    
    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found in this batch'
      });
    }
    
    const studentRollNos = students.map(student => student.rollno);

    // Then get all assessments for these students
    const assessments = await Assessment.findAll({
      where: {
        studentRollNo: studentRollNos
      },
      order: [
        ['studentRollNo', 'ASC'], 
        ['experimentNo', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch assessments',
      error: error.message
    });
  }
}; 