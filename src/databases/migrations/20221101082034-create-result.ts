module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.STRING,
      },
      user_email: {
        type: Sequelize.STRING,
      },
      test_name: {
        type: Sequelize.STRING,
      },
      assessment_name: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('results')
  },
}
