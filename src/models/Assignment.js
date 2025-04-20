import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  performanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  submissionDate: {
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
  status: {
    type: DataTypes.ENUM('Pending', 'Submitted', 'Graded', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending'
  }
}, {
  timestamps: true,
  paranoid: true // Enable soft deletes
});

// Add a hook to generate UUID before creation if not provided
Assignment.beforeCreate((assignment) => {
  if (!assignment.id) {
    assignment.id = uuidv4();
  }
});

export default Assignment;