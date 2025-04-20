'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Attendance_BE_10 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance_BE_10.init({
    attendance_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    attendance_status: DataTypes.STRING,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Attendance_BE_10',
  });
  return Attendance_BE_10;
};