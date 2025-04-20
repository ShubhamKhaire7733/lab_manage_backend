'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('assessments');
    
    const columnsToAdd = [
      {
        name: 'rppMarks',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      {
        name: 'spoMarks',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      {
        name: 'assignmentMarks',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      {
        name: 'finalAssignmentMarks',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      {
        name: 'testMarks',
        type: Sequelize.FLOAT,
        allowNull: true
      },
      {
        name: 'actualPerformanceDate',
        type: Sequelize.DATE,
        allowNull: true
      },
      {
        name: 'scheduledSubmissionDate',
        type: Sequelize.DATE,
        allowNull: true
      },
      {
        name: 'actualSubmissionDate',
        type: Sequelize.DATE,
        allowNull: true
      }
    ];

    for (const column of columnsToAdd) {
      if (!tableInfo[column.name]) {
        await queryInterface.addColumn('assessments', column.name, {
          type: column.type,
          allowNull: column.allowNull
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('assessments');
    
    const columnsToRemove = [
      'rppMarks',
      'spoMarks',
      'assignmentMarks',
      'finalAssignmentMarks',
      'testMarks',
      'actualPerformanceDate',
      'scheduledSubmissionDate',
      'actualSubmissionDate'
    ];

    for (const columnName of columnsToRemove) {
      if (tableInfo[columnName]) {
        await queryInterface.removeColumn('assessments', columnName);
      }
    }
  }
}; 