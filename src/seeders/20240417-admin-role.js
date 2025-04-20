export async function up(queryInterface, Sequelize) {
  try {
    // Check if admin role exists
    const adminRole = await queryInterface.rawSelect('Roles', {
      where: {
        role_name: 'Admin'
      }
    }, ['id']);

    if (!adminRole) {
      // Create admin role with all permissions
      await queryInterface.bulkInsert('Roles', [{
        role_name: 'Admin',
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
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      console.log('Admin role created with all permissions');
    } else {
      // Update existing admin role permissions
      await queryInterface.bulkUpdate('Roles', {
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
        },
        updatedAt: new Date()
      }, {
        where: {
          role_name: 'Admin'
        }
      });
      console.log('Admin role permissions updated');
    }
  } catch (error) {
    console.error('Error in admin role seeder:', error);
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {
  try {
    // Remove admin role
    await queryInterface.bulkDelete('Roles', {
      where: {
        role_name: 'Admin'
      }
    });
    console.log('Admin role removed');
  } catch (error) {
    console.error('Error in admin role seeder down:', error);
    throw error;
  }
} 