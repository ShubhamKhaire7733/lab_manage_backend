import { Role } from '../models/index.js';

async function updateAdminRole() {
  try {
    // Find or create admin role
    const [adminRole, created] = await Role.findOrCreate({
      where: { role_name: 'Admin' },
      defaults: {
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
      }
    });

    if (!created) {
      // Update existing admin role permissions
      await adminRole.update({
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
      });
      console.log('Admin role permissions updated');
    } else {
      console.log('Admin role created with all permissions');
    }
  } catch (error) {
    console.error('Error updating admin role:', error);
    process.exit(1);
  }
}

updateAdminRole();
