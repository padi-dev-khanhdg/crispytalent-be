const wrapvaluesWithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const hr_tests = [
  {
    id: 1,
    user_id: 2,
    test_id: 1,
  },

  {
    id: 2,
    user_id: 2,
    test_id: 2,
  },
]

module.exports = {
  async up(queryInterface) {
    return [await queryInterface.bulkInsert('hr_tests', wrapvaluesWithDateTime(hr_tests))]
  },

  async down() {},
}
