'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Assignments_Sub4_Div09_BE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assignments_Sub4_Div09_BE.init({
    assignment_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    assignment_name: DataTypes.STRING,
    scheduled_date: DataTypes.DATE,
    actual_date: DataTypes.DATE,
    submission_date: DataTypes.DATE,
    rpp_marks: DataTypes.INTEGER,
    spo_marks: DataTypes.INTEGER,
    total_marks: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Assignments_Sub4_Div09_BE',
  });
  return Assignments_Sub4_Div09_BE;
};