import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import { createUserDto } from '@dtos/user.dto'

export interface UserRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findByEmail(email: string): Promise<M>
  find(id: number): Promise<M>
  findAll(): Promise<M[]>
  createHr(createUserDto: createUserDto): Promise<M>
  findOrCreateUser(email: string): Promise<[M, boolean]>
}
