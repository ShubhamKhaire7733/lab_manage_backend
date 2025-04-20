'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Subjects_TE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subjects_TE.init({
    subject_id: DataTypes.INTEGER,
    subject_name: DataTypes.STRING,
    teacher_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subjects_TE',
  });
  return Subjects_TE;
};