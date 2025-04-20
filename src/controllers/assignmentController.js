import Assignment from '../models/Assignment.js';

const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { studentId: req.params.studentId },
      order: [['number', 'ASC']],
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    await assignment.update({
      submissionDate: new Date(),
      status: 'Submitted',
      ...req.body
    });
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment' });
  }
};

const updateAssignmentMarks = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    await assignment.update({
      rppMarks: req.body.rppMarks,
      spoMarks: req.body.spoMarks,
      assignmentMarks: req.body.assignmentMarks,
      status: 'Completed'
    });
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment marks' });
  }
};

export { getStudentAssignments, submitAssignment, updateAssignmentMarks };