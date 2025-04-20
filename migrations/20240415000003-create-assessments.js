'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assessments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentRollNo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      experimentNo: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      scheduledPerformanceDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualPerformanceDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      scheduledSubmissionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      actualSubmissionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rppMarks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 5
        }
      },
      spoMarks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 5
        }
      },
      assignmentMarks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 10
        }
      },
      finalAssignmentMarks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 60
        }
      },
      unitTest1Marks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 30
        }
      },
      unitTest2Marks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 30
        }
      },
      unitTest3Marks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 30
        }
      },
      convertedUnitTestMarks: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 20
        }
      },
      testMarks: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      theoryAttendanceMarks: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      finalMarks: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('Assessments', ['studentRollNo']);
    await queryInterface.addIndex('Assessments', ['experimentNo']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assessments');
  }
}; 