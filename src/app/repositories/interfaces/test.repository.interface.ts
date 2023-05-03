import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface TestRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  getAllTest(): Promise<M[]>
}
