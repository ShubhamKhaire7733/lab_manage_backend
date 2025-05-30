'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the assessments table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('assessments')) {
        console.log('Assessments table does not exist, skipping migration');
        return;
      }

      // Get current table structure
      const tableInfo = await queryInterface.describeTable('assessments');
      
      // Define columns to add
      const columnsToAdd = [
        {
          name: 'unitTest1Marks',
          config: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
              min: 0,
              max: 30
            }
          }
        },
        {
          name: 'unitTest2Marks',
          config: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
              min: 0,
              max: 30
            }
          }
        },
        {
          name: 'unitTest3Marks',
          config: {
            type: Sequelize.INTEGER,
            allowNull: true,
            validate: {
              min: 0,
              max: 30
            }
          }
        },
        {
          name: 'convertedUnitTestMarks',
          config: {
            type: Sequelize.FLOAT,
            allowNull: true,
            validate: {
              min: 0,
              max: 20
            }
          }
        }
      ];

      // Add columns if they don't exist
      for (const column of columnsToAdd) {
        if (!tableInfo[column.name]) {
          console.log(`Adding column ${column.name} to assessments table`);
          await queryInterface.addColumn('assessments', column.name, column.config);
        } else {
          console.log(`Column ${column.name} already exists in assessments table`);
        }
      }
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This migration doesn't remove any columns, so there's nothing to undo
  }
}; 