module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessment_tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assessment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'assessments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      test_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tests',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assessment_tests')
  },
}
