import sequelize from '../config/database.js';
import Role from '../models/Role.js';

async function createRoles() {
  try {
    // Create the Roles table
    await Role.sync({ force: true });
    console.log('Roles table created successfully');

    // Insert default roles
    const roles = await Role.bulkCreate([
      {
        role_name: 'admin',
        permissions: {
          createBatches: true,
          assignTeachers: true,
          manageUsers: true,
          viewAllData: true,
          modifyAllData: true,
          viewOwnBatches: true,
          manageOwnBatches: true,
          viewOwnStudents: true,
          manageOwnStudents: true,
          viewOwnAssessments: true,
          manageOwnAssessments: true,
          viewOwnAttendance: true,
          viewOwnMarks: true,
          modifyData: true,
          accessOthersData: true
        }
      },
      {
        role_name: 'teacher',
        permissions: {
          createBatches: false,
          assignTeachers: false,
          manageUsers: false,
          viewAllData: false,
          modifyAllData: false,
          viewOwnBatches: true,
          manageOwnBatches: true,
          viewOwnStudents: true,
          manageOwnStudents: true,
          viewOwnAssessments: true,
          manageOwnAssessments: true,
          viewOwnAttendance: true,
          viewOwnMarks: true,
          modifyData: true,
          accessOthersData: false
        }
      },
      {
        role_name: 'student',
        permissions: {
          createBatches: false,
          assignTeachers: false,
          manageUsers: false,
          viewAllData: false,
          modifyAllData: false,
          viewOwnBatches: false,
          manageOwnBatches: false,
          viewOwnStudents: false,
          manageOwnStudents: false,
          viewOwnAssessments: false,
          manageOwnAssessments: false,
          viewOwnAttendance: true,
          viewOwnMarks: true,
          modifyData: false,
          accessOthersData: false
        }
      }
    ]);

    console.log('Default roles created:', roles.map(role => role.role_name));
    process.exit(0);
  } catch (error) {
    console.error('Error creating roles:', error);
    process.exit(1);
  }
}

createRoles(); 