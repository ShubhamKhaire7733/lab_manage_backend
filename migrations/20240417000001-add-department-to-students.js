export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'department', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Computer Engineering'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'department');
  }
}; 