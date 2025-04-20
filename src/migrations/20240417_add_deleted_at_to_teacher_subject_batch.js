'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  try {
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('TeacherSubjectBatches');
    if (!tableInfo.deletedAt) {
      await queryInterface.addColumn('TeacherSubjectBatches', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true
      });
      console.log('Added deletedAt column to TeacherSubjectBatches table');
    } else {
      console.log('deletedAt column already exists in TeacherSubjectBatches table');
    }
  } catch (error) {
    console.error('Error in migration:', error);
    throw error;
  }
}

export async function down(queryInterface, Sequelize) {
  try {
    await queryInterface.removeColumn('TeacherSubjectBatches', 'deletedAt');
    console.log('Removed deletedAt column from TeacherSubjectBatches table');
  } catch (error) {
    console.error('Error in migration:', error);
    throw error;
  }
} 