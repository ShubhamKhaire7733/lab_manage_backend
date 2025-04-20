'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Division_TE_09 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Division_TE_09.init({
    division_id: DataTypes.INTEGER,
    division_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Division_TE_09',
  });
  return Division_TE_09;
};