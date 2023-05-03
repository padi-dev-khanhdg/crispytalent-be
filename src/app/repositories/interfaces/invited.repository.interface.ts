import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'
import { createInvitedDto } from '@dtos/invited.dto'

export interface InvitedRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  createInvited(createInvitedDto: createInvitedDto): Promise<M>
  findInvitedByAssessment(id: number): Promise<any>
}
