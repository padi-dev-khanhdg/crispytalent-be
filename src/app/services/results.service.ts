import ResultRepository from '@repositories/result.repository'
import { Service } from 'typedi'

@Service()
class ResultService {
  constructor(protected resultRepository: ResultRepository) {}
  async createResult(params: any) {
    return this.resultRepository.create(params)
  }
}

export default ResultService
