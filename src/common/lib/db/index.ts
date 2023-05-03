import { ModelCtor } from 'sequelize-typescript'

import DB from '@models/index'
import User from '@models/entities/user.entity'
import HrTest from '@models/entities/hr_test.entity'
import Assessment from '@models/entities/assessment.entity'
import AssessmentTest from '@models/entities/assessment_tests.entity'
import Invited from '@models/entities/invited.entity'
import Topic from '@models/entities/topic.entity'
import Result from '@models/entities/result.entity'
import Test from '@models/entities/test.entity'

export function getModelFromTableName(tableName: string): ModelCtor | undefined {
  let item = undefined
  switch (tableName) {
    case User.tableName:
      item = DB.sequelize.model(User)
      break
    case HrTest.tableName:
      item = DB.sequelize.model(HrTest)
      break
    case Assessment.tableName:
      item = DB.sequelize.model(Assessment)
      break
    case AssessmentTest.tableName:
      item = DB.sequelize.model(AssessmentTest)
      break
    case Invited.tableName:
      item = DB.sequelize.model(Invited)
      break
    case Topic.tableName:
      item = DB.sequelize.model(Topic)
      break
    case Result.tableName:
      item = DB.sequelize.model(Result)
      break
    case Test.tableName:
      item = DB.sequelize.model(Test)
      break
    default:
      item = undefined
      break
  }
  return item
}
