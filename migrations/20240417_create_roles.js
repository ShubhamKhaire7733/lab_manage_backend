'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          // Admin permissions
          createBatches: false,
          assignTeachers: false,
          manageUsers: false,
          viewAllData: false,
          modifyAllData: false,
          
          // Teacher permissions
          viewOwnBatches: false,
          manageOwnBatches: false,
          viewOwnStudents: false,
          manageOwnStudents: false,
          viewOwnAssessments: false,
          manageOwnAssessments: false,
          
          // Student permissions
          viewOwnAttendance: false,
          viewOwnMarks: false,
          modifyData: false,
          accessOthersData: false
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Insert default roles
    await queryInterface.bulkInsert('Roles', [
      {
        role_name: 'admin',
        permissions: JSON.stringify({
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
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'teacher',
        permissions: JSON.stringify({
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
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_name: 'student',
        permissions: JSON.stringify({
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
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
}; 