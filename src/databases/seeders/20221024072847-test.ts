const wrapWithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const tests = [
  {
    id: 1,
    name: 'Verbal challenge',
    description: 'Verbal challenge',
    time: 300,
    image_cover: 'https://i.pinimg.com/736x/ae/38/27/ae38274436f2c87cf110545b8046b305.jpg',
    score: 100,
  },

  {
    id: 2,
    name: 'Logical Test',
    description: 'Logicaltestaaafasfasfasf',
    time: 90,
    image_cover: 'https://i.pinimg.com/736x/ae/38/27/ae38274436f2c87cf110545b8046b305.jpg',
    score: 100,
  },
]

module.exports = {
  async up(queryInterface) {
    return [await queryInterface.bulkInsert('tests', wrapWithDateTime(tests))]
  },

  async down() {},
}
