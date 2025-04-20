import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Student from './Student.js';

// Model matching the exact column names in your database
const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentRollNo: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Student,
      key: 'rollNumber'
    }
  },
  experimentNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 12
    }
  },
  scheduledPerformanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualPerformanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  scheduledSubmissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualSubmissionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rppMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  spoMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  assignmentMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10
    }
  },
  unitTest1Marks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 30
    }
  },
  unitTest2Marks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 30
    }
  },
  unitTest3Marks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 30
    }
  },
  convertedUnitTestMarks: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  finalAssignmentMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 60
    }
  },
  testMarks: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  theoryAttendanceMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 20
    }
  },
  finalMarks: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['studentRollNo', 'experimentNo'],
      name: 'assessment_student_experiment_idx'
    }
  ]
});

export default Assessment; 