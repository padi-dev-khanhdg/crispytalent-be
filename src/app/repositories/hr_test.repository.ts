import HrTest from '@models/entities/hr_test.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HrTestRepositoryInterface } from './interfaces/hr_test.repository.interface'
import { createHrTestDto } from '@dtos/hr_test.dto'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class HrTestRepository extends BaseRepository<HrTest> implements HrTestRepositoryInterface<HrTest> {
  constructor(@ModelContainer(HrTest.tableName) HrTest: ModelCtor<HrTest>) {
    super(HrTest)
  }

  async createHrtest(createHrTestDto: createHrTestDto): Promise<HrTest> {
    return this.create(createHrTestDto)
  }

  async findHrTestByUser(user_id: number): Promise<any> {
    return this.findByOptionals({
      where: {
        user_id: user_id,
      },
      raw: true,
    })
  }
}

export default HrTestRepository
