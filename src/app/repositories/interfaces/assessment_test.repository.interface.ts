import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import { createAssessmentTestDto } from '@dtos/assessment_test.dto'

export interface AssessmentTestRepositoryInterface<M extends Model>
  extends BaseRepositoryInterface {
  createAssessmentTest(createAssessmentTestDto: createAssessmentTestDto): Promise<M>
  findAssessmentTestByAssessment(id: number): Promise<any>
}
