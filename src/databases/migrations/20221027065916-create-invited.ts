module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inviteds', {
      assessment_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'assessments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
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
    await queryInterface.dropTable('inviteds')
  },
}
