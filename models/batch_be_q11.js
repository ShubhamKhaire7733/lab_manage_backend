'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Batch_BE_Q11 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Batch_BE_Q11.init({
    batch_id: DataTypes.INTEGER,
    batch_name: DataTypes.STRING,
    division_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Batch_BE_Q11',
  });
  return Batch_BE_Q11;
};