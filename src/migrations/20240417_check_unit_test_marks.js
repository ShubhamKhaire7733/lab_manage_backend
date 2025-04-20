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
      
      // Log the columns that exist
      console.log('Existing columns in assessments table:');
      Object.keys(tableInfo).forEach(columnName => {
        console.log(`- ${columnName}: ${tableInfo[columnName].type}`);
      });
      
      // Check if unit test marks columns exist
      const unitTestColumns = [
        'unitTest1Marks',
        'unitTest2Marks',
        'unitTest3Marks',
        'convertedUnitTestMarks'
      ];
      
      const existingColumns = unitTestColumns.filter(column => tableInfo[column]);
      const missingColumns = unitTestColumns.filter(column => !tableInfo[column]);
      
      console.log('Existing unit test columns:', existingColumns);
      console.log('Missing unit test columns:', missingColumns);
      
      // This migration doesn't make any changes, it just logs information
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // This migration doesn't make any changes, so there's nothing to undo
  }
}; 