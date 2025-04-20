// File to establish all model associations
// Import all models
import Student from './Student.js';
import Assignment from './Assignment.js';
import User from './User.js';
import Teacher from './Teacher.js';
import Assessment from './Assessment.js';
import Batch from './Batch.js';
import Subject from './Subject.js';
import TeacherSubjectBatch from './TeacherSubjectBatch.js';
import Attendance from './Attendance.js';
import Performance from './Performance.js';

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Student, {
    foreignKey: 'userId',
    as: 'student',
    constraints: false
  });

  User.hasOne(Teacher, {
    foreignKey: 'userId',
    as: 'teacher'
  });

  // Student associations
  Student.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    constraints: false
  });

  Student.hasMany(Assignment, {
    foreignKey: 'studentId',
    as: 'assignments'
  });

  // Assessment associations
  Student.hasMany(Assessment, {
    foreignKey: 'studentRollNo',
    sourceKey: 'rollNumber',
    as: 'assessments'
  });

  Assessment.belongsTo(Student, {
    foreignKey: 'studentRollNo',
    targetKey: 'rollNumber',
    as: 'student'
  });

  Student.hasMany(Performance, {
    foreignKey: 'studentId',
    as: 'performances'
  });

  Student.belongsToMany(Batch, {
    through: 'StudentBatches',
    foreignKey: 'studentId',
    otherKey: 'batchId',
    as: 'Batches'
  });

  // Add Student-Attendance association
  Student.hasMany(Attendance, {
    foreignKey: 'studentId',
    as: 'attendances'
  });

  // Teacher associations
  Teacher.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Teacher.belongsToMany(Subject, {
    through: TeacherSubjectBatch,
    foreignKey: 'teacherId',
    otherKey: 'subjectId'
  });

  Teacher.belongsToMany(Batch, {
    through: TeacherSubjectBatch,
    foreignKey: 'teacherId',
    otherKey: 'batchId'
  });

  // Batch associations
  Batch.belongsToMany(Student, {
    through: 'StudentBatches',
    foreignKey: 'batchId',
    otherKey: 'studentId'
  });

  Batch.belongsToMany(Teacher, {
    through: TeacherSubjectBatch,
    foreignKey: 'batchId',
    otherKey: 'teacherId'
  });

  Batch.belongsToMany(Subject, {
    through: TeacherSubjectBatch,
    foreignKey: 'batchId',
    otherKey: 'subjectId'
  });

  // Subject associations
  Subject.belongsToMany(Teacher, {
    through: TeacherSubjectBatch,
    foreignKey: 'subjectId',
    otherKey: 'teacherId'
  });

  Subject.belongsToMany(Batch, {
    through: TeacherSubjectBatch,
    foreignKey: 'subjectId',
    otherKey: 'batchId'
  });

  // TeacherSubjectBatch associations
  TeacherSubjectBatch.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'assignedTeacher'
  });

  TeacherSubjectBatch.belongsTo(Subject, {
    foreignKey: 'subjectId',
    as: 'assignedSubject'
  });

  TeacherSubjectBatch.belongsTo(Batch, {
    foreignKey: 'batchId',
    as: 'assignedBatch'
  });

  // Assignment associations
  Assignment.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student'
  });

  // Attendance associations
  Attendance.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student'
  });

  Attendance.belongsTo(Batch, {
    foreignKey: 'batchId',
    as: 'batch'
  });

  // Performance associations
  Performance.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student'
  });

  console.log('Model associations set up successfully');
};

export default setupAssociations;

export { 
  User, 
  Teacher, 
  Student, 
  Assignment, 
  Assessment, 
  Batch, 
  Subject, 
  TeacherSubjectBatch,
  Attendance,
  Performance
}; 