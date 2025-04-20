'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Batches', 'rollNumberStart', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 23101,
      validate: {
        min: 23101,
        max: 45000
      }
    });

    await queryInterface.addColumn('Batches', 'rollNumberEnd', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 23120,
      validate: {
        min: 23101,
        max: 45000
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Batches', 'rollNumberStart');
    await queryInterface.removeColumn('Batches', 'rollNumberEnd');
  }
}; 