import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import { createHrTestDto } from '@dtos/hr_test.dto'

export interface HrTestRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  createHrtest(createHrTestDto: createHrTestDto): Promise<M>
  findHrTestByUser(id: number): Promise<any>
}
