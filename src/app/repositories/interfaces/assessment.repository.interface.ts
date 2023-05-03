import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import {
  createAssessmentDto,
  updateStatusAssessmentDto,
  updateSubLinkAssessmentDto,
  updateAssessmentDto,
} from '@dtos/assessment.dto'

export interface AssessmentRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  find(id: number): Promise<M>
  findAll(): Promise<M[]>
  findByStatus(status: string): Promise<any>
  createAssessment(createAssessmentDto: createAssessmentDto): Promise<M>
  updateAssessment(updateAssessmentDto: updateAssessmentDto, id: number): Promise<any>
  updateStatusAssessment(
    updateStatusAssessmentDto: updateStatusAssessmentDto,
    id: number,
  ): Promise<any>
  updateSubLinkAssessment(
    updateSubLinkAssessmentDto: updateSubLinkAssessmentDto,
    id: number,
  ): Promise<any>
  deleteAssessment(id: number): Promise<number>
  findBySubLink(email: string): Promise<M>
}
