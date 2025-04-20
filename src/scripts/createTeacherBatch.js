import { Batch, Subject, TeacherSubjectBatch, Teacher } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function createTeacherBatch() {
  try {
    // Find the teacher
    const teacher = await Teacher.findOne({
      where: { 
        email: 'bob@example.com',
        isActive: true
      }
    });

    if (!teacher) {
      console.error('Teacher not found');
      return;
    }

    console.log('Found teacher:', teacher.id);

    // Create a subject if it doesn't exist
    const [subject] = await Subject.findOrCreate({
      where: { name: 'Data Structures' },
      defaults: {
        id: uuidv4(),
        name: 'Data Structures',
        code: 'CS301',
        description: 'Introduction to Data Structures and Algorithms'
      }
    });

    console.log('Found/created subject:', subject.id);

    // Create a batch
    const batch = await Batch.create({
      id: uuidv4(),
      name: 'SE-A',
      year: 'SE',
      division: '9',
      rollNumberStart: 23101,
      rollNumberEnd: 23120,
      day: 'Monday',
      time: '10:00 AM - 12:00 PM',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-12-31')
    });

    console.log('Created batch:', batch.id);

    // Create the teacher-subject-batch assignment
    const assignment = await TeacherSubjectBatch.create({
      id: uuidv4(),
      teacherId: teacher.id,
      subjectId: subject.id,
      batchId: batch.id,
      division: '9',
      academicYear: '2024-2025',
      isActive: true
    });

    console.log('Created assignment:', assignment.id);
    console.log('Successfully set up teacher batch assignment');

  } catch (error) {
    console.error('Error creating teacher batch:', error);
  }
}

createTeacherBatch(); 