import Assessment from '@models/entities/assessment.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentRepositoryInterface } from './interfaces/assessment.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import { Op } from 'sequelize'
import {
  createAssessmentDto,
  updateAssessmentDto,
  updateStatusAssessmentDto,
  updateSubLinkAssessmentDto,
} from '@dtos/assessment.dto'
import AssessmentTest from '@models/entities/assessment_tests.entity'
import Test from '@models/entities/test.entity'

@Service({ global: true })
class AssessmentRepository
  extends BaseRepository<Assessment>
  implements AssessmentRepositoryInterface<Assessment>
{
  constructor(@ModelContainer(Assessment.tableName) Assessment: ModelCtor<Assessment>) {
    super(Assessment)
  }

  async getAssessmentWithGameById(id: number): Promise<Assessment> {
    return this.model.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: AssessmentTest,
          as: 'assessmentTests',
          include: [
            {
              model: Test,
              as: 'test',
            },
          ],
        },
      ],
    })
  }

  async find(id: number): Promise<Assessment> {
    return this.findById(id)
  }

  async findAll(): Promise<Assessment[]> {
    return this.getAll()
  }

  async findByStatus(status: string): Promise<any> {
    return this.getByCondition(
      {
        status: status,
      },
      0,
      6,
      [],
    )
  }

  async createAssessment(createAssessmentDto: createAssessmentDto): Promise<Assessment> {
    return this.create(createAssessmentDto)
  }

  async updateAssessment(updateAssessmentDto: updateAssessmentDto, id: number): Promise<any> {
    return this.update(updateAssessmentDto, {
      where: {
        id: id,
      },
    })
  }

  async updateStatusAssessment(
    updateStatusAssessmentDto: updateStatusAssessmentDto,
    id: number,
  ): Promise<any> {
    return this.update(updateStatusAssessmentDto, {
      where: {
        id: id,
      },
    })
  }

  async updateSubLinkAssessment(
    updateSubLinkAssessmentDto: updateSubLinkAssessmentDto,
    id: number,
  ): Promise<any> {
    return this.update(updateSubLinkAssessmentDto, {
      where: {
        id: id,
      },
    })
  }

  async deleteAssessment(id: number): Promise<number> {
    return this.deleteById(id)
  }

  async findBySubLink(sub_link: string): Promise<Assessment> {
    return this.findByCondition({
      where: {
        sub_link: sub_link,
      },
    })
  }
}

export default AssessmentRepository
