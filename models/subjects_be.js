'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Subjects_BE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subjects_BE.init({
    subject_id: DataTypes.INTEGER,
    subject_name: DataTypes.STRING,
    teacher_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subjects_BE',
  });
  return Subjects_BE;
};