import { Teacher, Batch, Subject, TeacherSubjectBatch } from '../src/models/index.js';
import sequelize from '../src/config/database.js';

const checkTeacherBatches = async () => {
  try {
    // Get all teacher-subject-batch associations
    const teacherBatches = await TeacherSubjectBatch.findAll({
      include: [
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'name']
        },
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Batch,
          as: 'batch',
          attributes: ['id', 'name', 'year', 'division']
        }
      ]
    });

    console.log('\nExisting TeacherSubjectBatch entries:');
    teacherBatches.forEach(tsb => {
      console.log('\nEntry:', {
        id: tsb.id,
        teacherId: tsb.teacherId,
        teacherName: tsb.teacher?.name,
        subjectId: tsb.subjectId,
        subjectName: tsb.subject?.name,
        batchId: tsb.batchId,
        batchName: tsb.batch?.name,
        division: tsb.division,
        academicYear: tsb.academicYear,
        isActive: tsb.isActive
      });
    });

    if (teacherBatches.length === 0) {
      console.log('No entries found in TeacherSubjectBatch table');
    }

  } catch (error) {
    console.error('Error checking teacher batches:', error);
  } finally {
    await sequelize.close();
  }
};

checkTeacherBatches(); 