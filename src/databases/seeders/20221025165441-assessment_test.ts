const wrapvalueswithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const assessment_tests = [
  {
    id: 1,
    assessment_id: 1,
    test_id: 1,
  },

  {
    id: 2,
    assessment_id: 1,
    test_id: 2,
  },
]

module.exports = {
  async up(queryInterface) {
    return [
      await queryInterface.bulkInsert('assessment_tests', wrapvalueswithDateTime(assessment_tests)),
    ]
  },

  async down() {},
}
