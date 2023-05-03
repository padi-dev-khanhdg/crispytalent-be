import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import { createResultDto } from '@dtos/result.dto'

export interface ResultRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findAllResult(): Promise<M[]>
  findResultByAssessment(id: number): Promise<M[]>
  createResult(createResultDto: createResultDto): Promise<M>
}
