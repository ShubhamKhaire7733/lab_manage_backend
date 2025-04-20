import { Teacher, Batch, Subject, TeacherSubjectBatch } from '../src/models/index.js';
import sequelize from '../src/config/database.js';

const insertTeacherBatches = async () => {
  try {
    // Get the first teacher
    const teacher = await Teacher.findOne();
    if (!teacher) {
      console.error('No teacher found in the database');
      return;
    }
    console.log('Found teacher:', teacher.name);

    // Get or create a batch
    const [batch] = await Batch.findOrCreate({
      where: {
        name: 'SE-9',
        year: 'SE',
        division: '9',
        day: 'Monday',
        time: '10:00 AM',
        rollNumberStart: 23101,
        rollNumberEnd: 23120,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
      }
    });
    console.log('Found/Created batch:', batch.name);

    // Get or create a subject
    const [subject] = await Subject.findOrCreate({
      where: {
        name: 'Operating Systems',
        code: 'OS'
      }
    });
    console.log('Found/Created subject:', subject.name);

    // Create the teacher-batch-subject association
    const teacherBatch = await TeacherSubjectBatch.create({
      teacherId: teacher.id,
      batchId: batch.id,
      subjectId: subject.id,
      division: '9',
      academicYear: '2024',
      isActive: true
    });

    console.log('Created teacher-batch association:', {
      teacherId: teacherBatch.teacherId,
      batchId: teacherBatch.batchId,
      subjectId: teacherBatch.subjectId
    });

    // Create another batch and association with a different subject
    const [batch2] = await Batch.findOrCreate({
      where: {
        name: 'SE-10',
        year: 'SE',
        division: '10',
        day: 'Tuesday',
        time: '2:00 PM',
        rollNumberStart: 23121,
        rollNumberEnd: 23140,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
      }
    });

    const [subject2] = await Subject.findOrCreate({
      where: {
        name: 'Database Management',
        code: 'DBMS'
      }
    });

    const teacherBatch2 = await TeacherSubjectBatch.create({
      teacherId: teacher.id,
      batchId: batch2.id,
      subjectId: subject2.id,
      division: '10',
      academicYear: '2024',
      isActive: true
    });

    console.log('Created second teacher-batch association:', {
      teacherId: teacherBatch2.teacherId,
      batchId: teacherBatch2.batchId,
      subjectId: teacherBatch2.subjectId
    });

    console.log('Successfully inserted teacher-batch associations');
  } catch (error) {
    console.error('Error inserting teacher batches:', error);
  } finally {
    await sequelize.close();
  }
};

insertTeacherBatches(); 