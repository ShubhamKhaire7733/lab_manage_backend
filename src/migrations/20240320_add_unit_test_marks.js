'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('assessments');
    
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

    for (const column of columnsToAdd) {
      if (!tableInfo[column.name]) {
        await queryInterface.addColumn('assessments', column.name, column.config);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('assessments');
    
    const columnsToRemove = [
      'unitTest1Marks',
      'unitTest2Marks',
      'unitTest3Marks',
      'convertedUnitTestMarks'
    ];

    for (const columnName of columnsToRemove) {
      if (tableInfo[columnName]) {
        await queryInterface.removeColumn('assessments', columnName);
      }
    }
  }
}; 