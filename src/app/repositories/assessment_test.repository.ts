import AssessmentTest from '@models/entities/assessment_tests.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentTestRepositoryInterface } from './interfaces/assessment_test.repository.interface'
import { createAssessmentTestDto } from '@dtos/assessment_test.dto'
import { ModelContainer } from '@decorators/model.decorator'
import Test from '@models/entities/test.entity'

@Service({ global: true })
class AssessmentTestRepository
  extends BaseRepository<AssessmentTest>
  implements AssessmentTestRepositoryInterface<AssessmentTest>
{
  constructor(@ModelContainer(AssessmentTest.tableName) AssessmentTest: ModelCtor<AssessmentTest>) {
    super(AssessmentTest)
  }

  async createAssessmentTest(
    createAssessmentTestDto: createAssessmentTestDto,
  ): Promise<AssessmentTest> {
    return this.create(createAssessmentTestDto)
  }

  async findAssessmentTestByAssessment(assessment_id: number): Promise<any> {
    return this.findByOptionals({
      where: {
        assessment_id: assessment_id,
      },
      include: {
        model: Test,
        as: 'test',
      },
      raw: true,
    })
  }
}

export default AssessmentTestRepository
