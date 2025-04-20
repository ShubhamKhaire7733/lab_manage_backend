import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Student from './Student.js';

const Performance = sequelize.define('Performance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Student,
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  paranoid: true // Enable soft deletes
});

// Remove the duplicate association
// Performance.belongsTo(Student, {
//   foreignKey: 'studentId',
//   as: 'student'
// });

export default Performance; 