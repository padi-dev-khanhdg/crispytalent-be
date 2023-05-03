import Result from '@models/entities/result.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { ResultRepositoryInterface } from './interfaces/result.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import { createResultDto } from '@dtos/result.dto'

@Service({ global: true })
class ResultRepository extends BaseRepository<Result> implements ResultRepositoryInterface<Result> {
  constructor(@ModelContainer(Result.tableName) Result: ModelCtor<Result>) {
    super(Result)
  }
  async findAllResult(): Promise<Result[]> {
    return this.getAll()
  }
  async createResult(createResultDto: createResultDto): Promise<Result> {
    return this.create(createResultDto)
  }

  async findResultByAssessment(assessment_id: number): Promise<Result[]> {
    return this.findByOptionals({
      where: {
        assessment_id: assessment_id,
      },
      raw: true,
    })
  }
}

export default ResultRepository
