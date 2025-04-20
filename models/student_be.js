'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Student_BE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Student_BE belongs to Batch_BE (foreign key: batch_id)
      Student_BE.belongsTo(models.Batch_BE, { foreignKey: 'batch_id' });
      
      // Student_BE belongs to Division_BE (foreign key: division_id)
      Student_BE.belongsTo(models.Division_BE, { foreignKey: 'division_id' });
      
      // Student_BE has many Attendance_BE (foreign key: student_id)
      Student_BE.hasMany(models.Attendance_BE, { foreignKey: 'student_id' });
      
      // Student_BE has many Assignments_Sub1_Div_BE (foreign key: student_id)
      Student_BE.hasMany(models.Assignments_Sub1_Div_BE, { foreignKey: 'student_id' });
    }
  }

  Student_BE.init({
    student_id: DataTypes.INTEGER,
    rollno: DataTypes.STRING,
    name: DataTypes.STRING,
    batch_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    year: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student_BE',
  });

  return Student_BE;
};
