'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments_Sub4_Div09_BEs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      assignment_id: {
        type: Sequelize.INTEGER
      },
      student_id: {
        type: Sequelize.INTEGER
      },
      assignment_name: {
        type: Sequelize.STRING
      },
      scheduled_date: {
        type: Sequelize.DATE
      },
      actual_date: {
        type: Sequelize.DATE
      },
      submission_date: {
        type: Sequelize.DATE
      },
      rpp_marks: {
        type: Sequelize.INTEGER
      },
      spo_marks: {
        type: Sequelize.INTEGER
      },
      total_marks: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Assignments_Sub4_Div09_BEs');
  }
};