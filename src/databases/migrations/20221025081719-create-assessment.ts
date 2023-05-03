const infinity = new Date()
infinity.setFullYear(5000, 12, 31)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        allowNull: false,
      },
      sub_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      job_function: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      job_position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: new Date(),
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: infinity,
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
    await queryInterface.dropTable('assessments')
  },
}
