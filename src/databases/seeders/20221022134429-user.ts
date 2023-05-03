const wrapValuesWithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const users = [
  {
    id: 1,
    email: 'user01@example.com',
    password: '$2b$10$42Zebc665LLiuZcawpcxSOshk9H0Xe/lq.XyG4IJKjkisIPaXHBrO',
    name: 'name user 1',
    role: 'admin',
  },

  {
    id: 2,
    email: 'user02@example.com',
    password: '$2b$10$42Zebc665LLiuZcawpcxSOshk9H0Xe/lq.XyG4IJKjkisIPaXHBrO',
    name: 'name user 2',
    role: 'hr',
  },

  {
    id: 3,
    email: 'user03@example.com',
    password: '$2b$10$42Zebc665LLiuZcawpcxSOshk9H0Xe/lq.XyG4IJKjkisIPaXHBrO',
    name: 'name user 3',
    role: 'hr',
  },
]

module.exports = {
  async up(queryInterface) {
    return [await queryInterface.bulkInsert('users', wrapValuesWithDateTime(users))]
  },

  async down() {},
}
