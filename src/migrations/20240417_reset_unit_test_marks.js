'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // First check if the columns exist and drop them if they do
      const tableInfo = await queryInterface.describeTable('assessments');
      const columnsToReset = ['unitTest1Marks', 'unitTest2Marks', 'unitTest3Marks', 'convertedUnitTestMarks'];
      
      for (const column of columnsToReset) {
        if (tableInfo[column]) {
          console.log(`Dropping existing column: ${column}`);
          await queryInterface.removeColumn('assessments', column);
        }
      }

      // Now add the columns back with the correct configuration
      await queryInterface.addColumn('assessments', 'unitTest1Marks', {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      });

      await queryInterface.addColumn('assessments', 'unitTest2Marks', {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      });

      await queryInterface.addColumn('assessments', 'unitTest3Marks', {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      });

      await queryInterface.addColumn('assessments', 'convertedUnitTestMarks', {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100
        }
      });

      console.log('Successfully reset unit test marks columns');
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const columnsToRemove = ['unitTest1Marks', 'unitTest2Marks', 'unitTest3Marks', 'convertedUnitTestMarks'];
      
      for (const column of columnsToRemove) {
        await queryInterface.removeColumn('assessments', column);
      }
    } catch (error) {
      console.error('Error in migration rollback:', error);
      throw error;
    }
  }
}; 