'use strict';
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // An assessment belongs to a student - to be replaced with the actual student models
      // This will need to be adjusted based on your actual student models (SE, TE, BE)
      // Assessment.belongsTo(models.Student_SE, { foreignKey: 'studentRollNo', targetKey: 'rollno' });
      // Assessment.belongsTo(models.Student_TE, { foreignKey: 'studentRollNo', targetKey: 'rollno' });
      // Assessment.belongsTo(models.Student_BE, { foreignKey: 'studentRollNo', targetKey: 'rollno' });
    }
  }
  
  Assessment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentRollNo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experimentNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scheduledPerformanceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualPerformanceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scheduledSubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualSubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rppMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      },
      allowNull: false
    },
    spoMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5
      },
      allowNull: false
    },
    assignmentMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 10
      },
      allowNull: false
    },
    finalAssignmentMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 60
      }
    },
    testMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 20
      }
    },
    theoryAttendanceMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 20
      }
    },
    finalMarks: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 50
      }
    }
  },
  {
    unitTest1Marks: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 20 }
    },
    unitTest2Marks: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 20 }
    },
    unitTest3Marks: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 20 }
    }
  },{
    sequelize,
    modelName: 'Assessment',
    timestamps: true
  });
  
  return Assessment;
}; 