module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      password: {
        type: Sequelize.STRING(255),
      },

      name: {
        type: Sequelize.STRING(255),
      },

      role: {
        type: Sequelize.STRING(255),
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

    await Promise.all([
      QueryInterface.addIndex('users', ['email'], {
        name: ['users', 'email', 'unique'].join('_'),
        indicesType: 'unique',
        type: 'unique',
      }),
    ])
  },

  down: async (queryInterface) => queryInterface.dropTable('users'),
}
