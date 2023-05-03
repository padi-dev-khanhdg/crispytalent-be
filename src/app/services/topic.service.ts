import TopicRepository from '@repositories/topic.repository'
import { Service } from 'typedi'

@Service()
class TopicService {
  constructor(protected topicRepository: TopicRepository) {}

  async getTopic(whereClause: any) {
    return this.topicRepository.getTopicByTest(whereClause)
  }

  async getTopicById(id: number) {
    return this.topicRepository.findById(id)
  }
}

export default TopicService
