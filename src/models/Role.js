import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      // Admin permissions
      createBatches: false,
      assignTeachers: false,
      manageUsers: false,
      viewAllData: false,
      modifyAllData: false,
      
      // Teacher permissions
      viewOwnBatches: false,
      manageOwnBatches: false,
      viewOwnStudents: false,
      manageOwnStudents: false,
      viewOwnAssessments: false,
      manageOwnAssessments: false,
      
      // Student permissions
      viewOwnAttendance: false,
      viewOwnMarks: false,
      modifyData: false,
      accessOthersData: false
    }
  }
}, {
  timestamps: true
});

export default Role; 