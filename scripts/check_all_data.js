import { Teacher, Batch, Subject, TeacherSubjectBatch } from '../src/models/index.js';
import sequelize from '../src/config/database.js';

const checkAllData = async () => {
  try {
    // Get all teachers
    const teachers = await Teacher.findAll();
    console.log('\nTeachers:', teachers.map(t => ({
      id: t.id,
      name: t.name,
      userId: t.userId
    })));

    // Get all subjects
    const subjects = await Subject.findAll();
    console.log('\nSubjects:', subjects.map(s => ({
      id: s.id,
      name: s.name,
      code: s.code
    })));

    // Get all batches
    const batches = await Batch.findAll();
    console.log('\nBatches:', batches.map(b => ({
      id: b.id,
      name: b.name,
      year: b.year,
      division: b.division
    })));

    // Get all teacher-subject-batch associations
    const teacherBatches = await TeacherSubjectBatch.findAll();
    console.log('\nTeacherSubjectBatch entries:', teacherBatches.map(tsb => ({
      id: tsb.id,
      teacherId: tsb.teacherId,
      subjectId: tsb.subjectId,
      batchId: tsb.batchId,
      division: tsb.division,
      academicYear: tsb.academicYear,
      isActive: tsb.isActive
    })));

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await sequelize.close();
  }
};

checkAllData(); 