'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Batches', 'rollNumberStart', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 23101
      });

      await queryInterface.addColumn('Batches', 'rollNumberEnd', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 23120
      });

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Batches', 'rollNumberStart');
      await queryInterface.removeColumn('Batches', 'rollNumberEnd');
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  }
}; 