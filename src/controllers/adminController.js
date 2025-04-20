import { Batch, Student, Teacher, User, Attendance, Subject, TeacherSubjectBatch, Assignment } from '../models/index.js';
import { Op } from 'sequelize';
import excel from 'exceljs';
import { Parser } from 'json2csv';
import csv from 'csv-parser';
import fs from 'fs';

// Get all students with their marks
export const getAllStudentsWithMarks = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{
        model: User,
        attributes: ['name', 'email']
      }]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get basic counts
    const [studentCount, teacherCount, batchCount] = await Promise.all([
      Student.count(),
      Teacher.count(),
      Batch.count()
    ]);

    const stats = {
      counts: {
        students: studentCount,
        teachers: teacherCount,
        batches: batchCount
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Batch Management
export const createBatch = async (req, res) => {
  try {
    const { name, year, division, day, time, startDate, endDate, teacherId, subjectId } = req.body;
    
    // Create the batch
    const batch = await Batch.create({
      name,
      year,
      division,
      day,
      time,
      startDate,
      endDate,
      teacherId
    });
    
    // Create teacher allocation
    if (teacherId && subjectId) {
      await TeacherSubjectBatch.create({
        teacherId,
        subjectId,
        batchId: batch.id,
        division,
        academicYear: new Date().getFullYear().toString()
      });
    }
    
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, year, division, day, time, startDate, endDate, teacherId, subjectId } = req.body;
    
    const batch = await Batch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    // Update batch
    await batch.update({ 
      name, 
      year, 
      division, 
      day, 
      time, 
      startDate, 
      endDate, 
      teacherId 
    });
    
    // Update teacher allocation if teacher or subject changed
    if (teacherId && subjectId) {
      const existingAllocation = await TeacherSubjectBatch.findOne({
        where: { batchId: id }
      });
      
      if (existingAllocation) {
        await existingAllocation.update({
          teacherId,
          subjectId,
          division
        });
      } else {
        await TeacherSubjectBatch.create({
          teacherId,
          subjectId,
          batchId: id,
          division,
          academicYear: new Date().getFullYear().toString()
        });
      }
    }
    
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    await batch.destroy();
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: Teacher,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Subject,
          through: TeacherSubjectBatch,
          attributes: ['id', 'name', 'code']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Format the response
    const formattedBatches = batches.map(batch => {
      const batchData = batch.toJSON();
      return {
        id: batchData.id,
        name: batchData.name,
        year: batchData.year,
        division: batchData.division,
        day: batchData.day,
        time: batchData.time,
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        teacher: batchData.Teacher ? {
          id: batchData.Teacher.id,
          name: batchData.Teacher.name,
          email: batchData.Teacher.email
        } : null,
        subject: batchData.Subjects && batchData.Subjects[0] ? {
          id: batchData.Subjects[0].id,
          name: batchData.Subjects[0].name,
          code: batchData.Subjects[0].code
        } : null
      };
    });

    console.log('Formatted batches:', formattedBatches);
    res.json(formattedBatches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id, {
      include: [
        {
          model: Teacher,
          attributes: ['id', 'name', 'email']
        },
        {
          model: TeacherSubjectBatch,
          include: [
            {
              model: Subject,
              attributes: ['id', 'name', 'code']
            }
          ]
        }
      ]
    });
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Attendance Management
export const markAttendance = async (req, res) => {
  try {
    const { batchId, date, attendanceData } = req.body;
    const attendanceRecords = await Promise.all(
      attendanceData.map(record => 
        Attendance.create({
          studentId: record.studentId,
          batchId,
          date,
          status: record.status,
          remarks: record.remarks
        })
      )
    );
    res.status(201).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const { batchId, startDate, endDate } = req.query;
    const attendance = await Attendance.findAll({
      where: {
        batchId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Student,
        include: [{
          model: User,
          attributes: ['name', 'email']
        }]
      }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportAttendanceData = async (req, res) => {
  try {
    const { batchId, startDate, endDate } = req.query;
    const attendance = await Attendance.findAll({
      where: {
        batchId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Student,
        include: [{
          model: User,
          attributes: ['name', 'email']
        }]
      }]
    });

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
      { header: 'Date', key: 'date' },
      { header: 'Student Name', key: 'studentName' },
      { header: 'Email', key: 'email' },
      { header: 'Status', key: 'status' },
      { header: 'Remarks', key: 'remarks' }
    ];

    attendance.forEach(record => {
      worksheet.addRow({
        date: record.date,
        studentName: record.Student.User.name,
        email: record.Student.User.email,
        status: record.status,
        remarks: record.remarks
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subject Management
export const createSubject = async (req, res) => {
  try {
    const { name, code, description, credits } = req.body;
    const subject = await Subject.create({
      name,
      code,
      description,
      credits
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, credits } = req.body;
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    await subject.update({ name, code, description, credits });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    await subject.destroy();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher Allocation
export const allocateTeacher = async (req, res) => {
  try {
    const { teacherId, subjectId, batchId, division, academicYear } = req.body;
    
    console.log('Creating teacher allocation with data:', {
      teacherId,
      subjectId,
      batchId,
      division,
      academicYear
    });
    
    // Verify that the teacher, subject, and batch exist
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    // Check if the allocation already exists
    const existingAllocation = await TeacherSubjectBatch.findOne({
      where: {
        teacherId,
        subjectId,
        batchId,
        division,
        academicYear,
        isActive: true
      }
    });
    
    if (existingAllocation) {
      return res.status(400).json({ 
        message: 'Teacher allocation already exists',
        details: {
          teacher: teacher.name,
          subject: subject.name,
          batch: batch.name,
          division,
          academicYear
        }
      });
    }
    
    // Create the allocation
    const allocation = await TeacherSubjectBatch.create({
      teacherId,
      subjectId,
      batchId,
      division,
      academicYear,
      isActive: true
    });
    
    console.log('Created teacher allocation:', allocation.toJSON());
    
    // Fetch the created allocation with associations
    const createdAllocation = await TeacherSubjectBatch.findByPk(allocation.id, {
      include: [
        {
          model: Teacher,
          as: 'assignedTeacher',
          include: [{
            model: User,
            as: 'user',
            attributes: ['email', 'role']
          }]
        },
        {
          model: Subject,
          as: 'assignedSubject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Batch,
          as: 'assignedBatch',
          attributes: ['id', 'name', 'year', 'division', 'day', 'time']
        }
      ]
    });
    
    // Format the response
    const allocationData = createdAllocation.toJSON();
    const formattedAllocation = {
      id: allocationData.id,
      teacher: allocationData.assignedTeacher ? {
        id: allocationData.assignedTeacher.id,
        name: allocationData.assignedTeacher.name,
        email: allocationData.assignedTeacher.email
      } : null,
      subject: allocationData.assignedSubject ? {
        id: allocationData.assignedSubject.id,
        name: allocationData.assignedSubject.name,
        code: allocationData.assignedSubject.code
      } : null,
      batch: allocationData.assignedBatch ? {
        id: allocationData.assignedBatch.id,
        name: allocationData.assignedBatch.name,
        year: allocationData.assignedBatch.year,
        division: allocationData.assignedBatch.division,
        day: allocationData.assignedBatch.day,
        time: allocationData.assignedBatch.time
      } : null,
      division: allocationData.division,
      academicYear: allocationData.academicYear
    };
    
    console.log('Formatted allocation response:', formattedAllocation);
    res.status(201).json(formattedAllocation);
  } catch (error) {
    console.error('Error creating teacher allocation:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Teacher allocation already exists',
        error: error.errors[0].message
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacherAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, subjectId, batchId, division, academicYear } = req.body;
    const allocation = await TeacherSubjectBatch.findByPk(id);
    if (!allocation) {
      return res.status(404).json({ message: 'Allocation not found' });
    }
    await allocation.update({
      teacherId,
      subjectId,
      batchId,
      division,
      academicYear
    });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacherAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const allocation = await TeacherSubjectBatch.findByPk(id);
    if (!allocation) {
      return res.status(404).json({ message: 'Allocation not found' });
    }
    await allocation.destroy();
    res.json({ message: 'Allocation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherAllocations = async (req, res) => {
  try {
    console.log('Fetching teacher allocations...');
    
    const allocations = await TeacherSubjectBatch.findAll({
      include: [
        {
          model: Teacher,
          as: 'assignedTeacher',
          include: [{
            model: User,
            as: 'user',
            attributes: ['email', 'role']
          }]
        },
        {
          model: Subject,
          as: 'assignedSubject',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Batch,
          as: 'assignedBatch',
          attributes: ['id', 'name', 'year', 'division', 'day', 'time']
        }
      ],
      where: {
        isActive: true
      },
      order: [['createdAt', 'DESC']]
    });

    console.log('Raw allocations:', JSON.stringify(allocations, null, 2));

    // Format the response
    const formattedAllocations = allocations.map(allocation => {
      const allocationData = allocation.toJSON();
      console.log('Processing allocation:', allocationData.id);
      console.log('Teacher data:', allocationData.assignedTeacher);
      console.log('Subject data:', allocationData.assignedSubject);
      console.log('Batch data:', allocationData.assignedBatch);
      
      return {
        id: allocationData.id,
        teacher: allocationData.assignedTeacher ? {
          id: allocationData.assignedTeacher.id,
          name: allocationData.assignedTeacher.name,
          email: allocationData.assignedTeacher.email
        } : null,
        subject: allocationData.assignedSubject ? {
          id: allocationData.assignedSubject.id,
          name: allocationData.assignedSubject.name,
          code: allocationData.assignedSubject.code
        } : null,
        batch: allocationData.assignedBatch ? {
          id: allocationData.assignedBatch.id,
          name: allocationData.assignedBatch.name,
          year: allocationData.assignedBatch.year,
          division: allocationData.assignedBatch.division,
          day: allocationData.assignedBatch.day,
          time: allocationData.assignedBatch.time
        } : null,
        division: allocationData.division,
        academicYear: allocationData.academicYear
      };
    });

    console.log('Formatted allocations:', formattedAllocations);
    res.json(formattedAllocations);
  } catch (error) {
    console.error('Error fetching teacher allocations:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export batch-wise data
export const exportBatchData = async (req, res) => {
  try {
    const { batchId, subjectId } = req.query;
    
    // Get all students in the batch with their assessments for the subject
    const students = await Student.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        },
        {
          model: Assessment,
          where: {
            subjectId
          },
          required: false
        }
      ],
      where: {
        '$Student.Batches.id$': batchId
      }
    });

    // Format data for CSV
    const data = students.map(student => ({
      rollNumber: student.rollNumber,
      name: student.User.name,
      email: student.User.email,
      attendanceMarks: student.attendanceMarks,
      assignments: student.Assessments?.length || 0,
      averageMarks: student.Assessments?.length 
        ? student.Assessments.reduce((acc, curr) => acc + (curr.finalMarks || 0), 0) / student.Assessments.length 
        : 0
    }));

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=batch-${batchId}-subject-${subjectId}.csv`);
    
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher Management
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Use default password if none provided
    const defaultPassword = 'teacher123';
    const finalPassword = password || defaultPassword;
    
    // Create user first
    const user = await User.create({
      name,
      email,
      password: finalPassword,
      role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user.id,
      name,
      email
    });

    res.status(201).json({
      message: 'Teacher created successfully',
      defaultPassword: !password ? defaultPassword : undefined,
      teacher: {
        id: teacher.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const teacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update user information
    await teacher.User.update({ name, email });

    // Fetch updated teacher data
    const updatedTeacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete teacher and associated user
    await teacher.destroy();
    await User.destroy({ where: { id: teacher.userId } });

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'role']
      }],
      where: {
        isActive: true
      },
      order: [['name', 'ASC']]
    });

    // Format the response to include user information
    const formattedTeachers = teachers.map(teacher => {
      const teacherData = teacher.toJSON();
      return {
        id: teacherData.id,
        name: teacherData.name,
        email: teacherData.email,
        department: teacherData.department,
        phone: teacherData.phone,
        subjects: teacherData.subjects ? 
          (typeof teacherData.subjects === 'string' ? 
            JSON.parse(teacherData.subjects) : 
            teacherData.subjects) : 
          []
      };
    });

    console.log('Formatted teachers:', formattedTeachers);
    res.json(formattedTeachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload students or teachers data from CSV
export const uploadData = async (req, res) => {
  try {
    const { type } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const results = [];
    
    // Parse CSV file
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Remove the temporary file
        fs.unlinkSync(file.path);
        
        if (type === 'students') {
          // Process student data
          const studentPromises = results.map(async (row) => {
            try {
              // Validate required fields
              if (!row.name || !row.email || !row.rollNumber || !row.year || !row.division) {
                return { success: false, email: row.email, error: 'Missing required fields' };
              }
              
              // Check if user already exists
              let user = await User.findOne({ where: { email: row.email } });
              
              if (!user) {
                // Create new user
                user = await User.create({
                  name: row.name,
                  email: row.email,
                  password: row.password || 'password123', // Default password
                  role: 'student'
                });
              }
              
              // Check if student already exists
              const existingStudent = await Student.findOne({ 
                where: { userId: user.id } 
              });
              
              if (!existingStudent) {
                // Create new student
                await Student.create({
                  userId: user.id,
                  name: row.name,
                  email: row.email,
                  rollNumber: row.rollNumber,
                  year: row.year,
                  division: row.division
                });
              } else {
                // Update existing student
                await existingStudent.update({
                  name: row.name,
                  email: row.email,
                  rollNumber: row.rollNumber,
                  year: row.year,
                  division: row.division
                });
              }
              
              return { success: true, email: row.email };
            } catch (err) {
              console.error(`Error processing student ${row.email}:`, err);
              return { success: false, email: row.email, error: err.message };
            }
          });
          
          const studentResults = await Promise.all(studentPromises);
          const successCount = studentResults.filter(r => r.success).length;
          const failureCount = studentResults.filter(r => !r.success).length;
          
          return res.status(200).json({
            message: `Successfully processed ${successCount} students, ${failureCount} failed`,
            details: studentResults
          });
        } else if (type === 'teachers') {
          // Process teacher data
          const teacherPromises = results.map(async (row) => {
            try {
              // Validate required fields
              if (!row.name || !row.email || !row.department) {
                return { success: false, email: row.email, error: 'Missing required fields' };
              }
              
              // Check if user already exists
              let user = await User.findOne({ where: { email: row.email } });
              
              if (!user) {
                // Create new user with default password if none provided
                const defaultPassword = 'teacher123';
                user = await User.create({
                  name: row.name,
                  email: row.email,
                  password: row.password || defaultPassword,
                  role: 'teacher'
                });
              } else if (row.password) {
                // Update password if provided in CSV
                user.password = row.password;
                await user.save();
              }
              
              // Check if teacher already exists
              const existingTeacher = await Teacher.findOne({ where: { userId: user.id } });
              
              if (!existingTeacher) {
                // Create new teacher
                await Teacher.create({
                  userId: user.id,
                  name: row.name,
                  email: row.email,
                  department: row.department,
                  subjects: row.subjects ? JSON.parse(row.subjects.replace(/'/g, '"')) : [],
                  phone: row.phone || null
                });
              } else {
                // Update existing teacher
                await existingTeacher.update({
                  name: row.name,
                  email: row.email,
                  department: row.department,
                  subjects: row.subjects ? JSON.parse(row.subjects.replace(/'/g, '"')) : existingTeacher.subjects,
                  phone: row.phone || existingTeacher.phone
                });
              }
              
              return { 
                success: true, 
                email: row.email,
                defaultPassword: !row.password ? 'teacher123' : undefined
              };
            } catch (err) {
              console.error(`Error processing teacher ${row.email}:`, err);
              return { success: false, email: row.email, error: err.message };
            }
          });
          
          const teacherResults = await Promise.all(teacherPromises);
          const successCount = teacherResults.filter(r => r.success).length;
          const failureCount = teacherResults.filter(r => !r.success).length;
          
          // Get list of teachers with default passwords
          const teachersWithDefaultPasswords = teacherResults
            .filter(r => r.success && r.defaultPassword)
            .map(r => ({ email: r.email, password: r.defaultPassword }));
          
          return res.status(200).json({
            message: `Successfully processed ${successCount} teachers, ${failureCount} failed`,
            details: teacherResults,
            defaultPasswords: teachersWithDefaultPasswords.length > 0 ? teachersWithDefaultPasswords : undefined
          });
        } else {
          return res.status(400).json({ message: 'Invalid upload type' });
        }
      });
  } catch (err) {
    console.error('Error uploading data:', err);
    return res.status(500).json({ message: 'Error uploading data', error: err.message });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'rollNumber', 'name', 'year', 'division']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'name', 'department']
        }
      ],
      order: [['email', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, role, name, rollNumber, year, division, department } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password, // Password will be hashed by the User model
      role
    });

    // Create role-specific profile
    if (role === 'student' && rollNumber && year && division) {
      await Student.create({
        userId: user.id,
        rollNumber,
        name: name || email.split('@')[0],
        email,
        year,
        division
      });
    } else if (role === 'teacher' && name && department) {
      await Teacher.create({
        userId: user.id,
        name,
        email,
        department
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role, name, rollNumber, year, division, department, isActive } = req.body;

    // Find user
    const user = await User.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Teacher,
          as: 'teacher'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    if (email) user.email = email;
    if (password) user.password = password; // Password will be hashed by the User model
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Update role-specific profile
    if (user.role === 'student' && user.student) {
      if (name) user.student.name = name;
      if (rollNumber) user.student.rollNumber = rollNumber;
      if (year) user.student.year = year;
      if (division) user.student.division = division;
      await user.student.save();
    } else if (user.role === 'teacher' && user.teacher) {
      if (name) user.teacher.name = name;
      if (department) user.teacher.department = department;
      await user.teacher.save();
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: Teacher,
          as: 'teacher'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete role-specific profile
    if (user.role === 'student' && user.student) {
      await user.student.destroy();
    } else if (user.role === 'teacher' && user.teacher) {
      await user.teacher.destroy();
    }

    // Delete user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

export default {
  getAllStudentsWithMarks,
  getDashboardStats,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatches,
  getBatchById,
  markAttendance,
  getAttendanceReport,
  exportAttendanceData,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjects,
  allocateTeacher,
  updateTeacherAllocation,
  deleteTeacherAllocation,
  getTeacherAllocations,
  exportBatchData,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachers,
  getTeacherById,
  uploadData,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}; 