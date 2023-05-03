const wrapValueswithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const current = new Date()
const firstThisWeek = current.getDate() - current.getDay() + 1

const assessments = [
  {
    id: 1,
    name: 'Assessment 1',
    user_id: 2,
    status: 1,
    job_function: 'backend',
    job_position: 'intern',
    start_date: new Date(new Date().setDate(firstThisWeek - 7)).toISOString(),
    end_date: new Date(new Date().setDate(firstThisWeek + 7)).toISOString(),
  },

  {
    id: 2,
    name: 'Assessment 2',
    user_id: 3,
    status: 0,
    job_function: 'frontend',
    job_position: 'intern',
    start_date: new Date(new Date().setDate(firstThisWeek - 6)).toISOString(),
    end_date: new Date(new Date().setDate(firstThisWeek + 8)).toISOString(),
  },
]

module.exports = {
  async up(queryInterface) {
    return [await queryInterface.bulkInsert('assessments', wrapValueswithDateTime(assessments))]
  },

  async down() {
    return
  },
}
