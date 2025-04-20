'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Student_TE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Student_TE belongs to Batch_TE (foreign key: batch_id)
      Student_TE.belongsTo(models.Batch_TE, { foreignKey: 'batch_id' });
      
      // Student_TE belongs to Division_TE (foreign key: division_id)
      Student_TE.belongsTo(models.Division_TE, { foreignKey: 'division_id' });
      
      // Student_TE has many Attendance_TE (foreign key: student_id)
      Student_TE.hasMany(models.Attendance_TE, { foreignKey: 'student_id' });
      
      // Student_TE has many Assignments_Sub1_Div_TE (foreign key: student_id)
      Student_TE.hasMany(models.Assignments_Sub1_Div_TE, { foreignKey: 'student_id' });
    }
  }

  Student_TE.init({
    student_id: DataTypes.INTEGER,
    rollno: DataTypes.STRING,
    name: DataTypes.STRING,
    batch_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    year: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student_TE',
  });

  return Student_TE;
};
