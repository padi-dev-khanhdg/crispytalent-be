import TestRepository from '@repositories/test.repository'
import { Service } from 'typedi'

@Service()
class TestService {
  constructor(protected testRepository: TestRepository) {}

  async findById(id: number) {
    return this.testRepository.findById(id)
  }
}

export default TestService
