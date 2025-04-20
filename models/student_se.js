'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Student_SE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Student_SE belongs to Batch_SE_E9 (foreign key: batch_id)
      Student_SE.belongsTo(models.Batch_SE_E9, { foreignKey: 'batch_id' });
      
      // Student_SE belongs to Division_SE_09 (foreign key: division_id)
      Student_SE.belongsTo(models.Division_SE_09, { foreignKey: 'division_id' });
      
      // Student_SE has many Attendance_SE_9 (foreign key: student_id)
      Student_SE.hasMany(models.Attendance_SE_9, { foreignKey: 'student_id' });
      
      // Student_SE has many Assignments_Sub1_Div09_SE (foreign key: student_id)
      Student_SE.hasMany(models.Assignments_Sub1_Div09_SE, { foreignKey: 'student_id' });
    }
  }

  Student_SE.init({
    student_id: DataTypes.INTEGER,
    rollno: DataTypes.STRING,
    name: DataTypes.STRING,
    batch_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    year: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student_SE',
  });

  return Student_SE;
};
