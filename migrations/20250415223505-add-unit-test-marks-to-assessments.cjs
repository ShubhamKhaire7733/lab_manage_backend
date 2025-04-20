'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('assessments');
    
    if (!tableInfo.unitTest1Marks) {
      await queryInterface.addColumn('assessments', 'unitTest1Marks', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableInfo.unitTest2Marks) {
      await queryInterface.addColumn('assessments', 'unitTest2Marks', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    
    if (!tableInfo.unitTest3Marks) {
      await queryInterface.addColumn('assessments', 'unitTest3Marks', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('assessments');
    
    if (tableInfo.unitTest1Marks) {
      await queryInterface.removeColumn('assessments', 'unitTest1Marks');
    }
    
    if (tableInfo.unitTest2Marks) {
      await queryInterface.removeColumn('assessments', 'unitTest2Marks');
    }
    
    if (tableInfo.unitTest3Marks) {
      await queryInterface.removeColumn('assessments', 'unitTest3Marks');
    }
  }
};
