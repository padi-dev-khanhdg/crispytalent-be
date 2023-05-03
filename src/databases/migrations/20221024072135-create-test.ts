module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.createTable('tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      image_cover: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    })
  },

  down: async (queryInterface) => queryInterface.dropTable('tests'),
}
