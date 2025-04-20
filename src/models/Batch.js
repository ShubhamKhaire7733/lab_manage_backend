import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Teacher from './Teacher.js';
import { v4 as uuidv4 } from 'uuid';

const Batch = sequelize.define('Batch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.ENUM('SE', 'TE', 'BE'),
    allowNull: false
  },
  division: {
    type: DataTypes.ENUM('9', '10', '11'),
    allowNull: false
  },
  rollNumberStart: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 23101,
      max: 45000
    }
  },
  rollNumberEnd: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 23101,
      max: 45000,
      isGreaterThanStart(value) {
        if (parseInt(value) <= parseInt(this.rollNumberStart)) {
          throw new Error('End roll number must be greater than start roll number');
        }
      }
    }
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Teacher,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true // Enable soft deletes
});

export default Batch; 