import Topic from '@models/entities/topic.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { TopicRepositoryInterface } from './interfaces/topic.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import { Sequelize } from 'sequelize'

@Service({ global: true })
class TopicRepository extends BaseRepository<Topic> implements TopicRepositoryInterface<Topic> {
  constructor(@ModelContainer(Topic.tableName) Topic: ModelCtor<Topic>) {
    super(Topic)
  }

  async getTopicByTest(whereClause: any): Promise<Topic> {
    return this.findByCondition({
      where: whereClause,
      raw: true,
      order: Sequelize.literal('rand()'),
    })
  }

  async getTopicsAnswer(topics: number[]): Promise<any> {
    return this.findByOptionals({
      where: {
        id: topics,
      },
      attributes: ['id', 'answer'],
      raw: true,
    })
  }
}

export default TopicRepository
