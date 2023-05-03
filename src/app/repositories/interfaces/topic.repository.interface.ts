import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface TopicRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  getTopicByTest(id: number): Promise<M>
  getTopicsAnswer(topics: number[]): Promise<any>
}
