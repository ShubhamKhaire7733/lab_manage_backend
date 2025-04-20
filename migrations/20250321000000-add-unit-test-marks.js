'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('assessments', 'unitTest1Marks', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('assessments', 'unitTest2Marks', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('assessments', 'unitTest3Marks', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('assessments', 'convertedUnitTestMarks', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('assessments', 'unitTest1Marks');
    await queryInterface.removeColumn('assessments', 'unitTest2Marks');
    await queryInterface.removeColumn('assessments', 'unitTest3Marks');
    await queryInterface.removeColumn('assessments', 'convertedUnitTestMarks');
  }
}; 