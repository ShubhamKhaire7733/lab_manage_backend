'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    try {
      // Check if column already exists
      const tableInfo = await queryInterface.describeTable('Students');
      if (!tableInfo.department) {
        await queryInterface.addColumn('Students', 'department', {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'Computer Engineering'
        });
        console.log('Added department column to Students table');
      } else {
        console.log('Department column already exists in Students table');
      }
    } catch (error) {
      console.error('Error adding department column:', error);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeColumn('Students', 'department');
      console.log('Removed department column from Students table');
    } catch (error) {
      console.error('Error removing department column:', error);
      throw error;
    }
  }
}; 