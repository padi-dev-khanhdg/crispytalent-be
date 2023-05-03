import Invited from '@models/entities/invited.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { InvitedRepositoryInterface } from './interfaces/invited.repository.interface'
import { createInvitedDto } from '@dtos/invited.dto'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class InvitedRepository
  extends BaseRepository<Invited>
  implements InvitedRepositoryInterface<Invited>
{
  constructor(@ModelContainer(Invited.tableName) Invited: ModelCtor<Invited>) {
    super(Invited)
  }

  async createInvited(createInvitedDto: createInvitedDto): Promise<Invited> {
    return this.create(createInvitedDto)
  }

  async findInvitedByAssessment(assessment_id: number): Promise<any> {
    return this.getByCondition(
      {
        assessment_id: assessment_id,
      },
      0,
      6,
      'created_at',
    )
  }
}

export default InvitedRepository
