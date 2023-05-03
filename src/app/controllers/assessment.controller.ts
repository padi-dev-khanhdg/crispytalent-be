import {
  Get,
  JsonController,
  Authorized,
  Req,
  Res,
  Post,
  Put,
  BadRequestError,
  Delete,
  UseBefore,
  ForbiddenError,
  QueryParam,
  Body,
} from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AssessmentRepository from '@repositories/assessment.repository'
import AssessmentTestRepository from '@repositories/assessment_test.repository'
import AssessmentTest from '@models/entities/assessment_tests.entity'
import HrTestRepository from '@repositories/hr_test.repository'
import HrTest from '@models/entities/hr_test.entity'
import InvitedRepository from '@repositories/invited.repository'
import Invited from '@models/entities/invited.entity'
import TopicRepository from '@repositories/topic.repository'
import Topic from '@models/entities/topic.entity'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { HrMiddleware } from '@middlewares/hr.middleware'
import { CandidateMiddleware } from '@middlewares/candidate.middleware'
import { arraysTestInclude } from '@utils/checkTest'
import { createAccessToken } from '@utils/token'
import User from '@models/entities/user.entity'
import UserRepository from '@repositories/user.repository'
import { getScore } from '@utils/getScore'
import ResultRepository from '@repositories/result.repository'
import Result from '@models/entities/result.entity'
import validationMiddleware from '@middlewares/validation.middleware'
import {
  CandidateLoginDto,
  GetInfoAssessmentDto,
  GetListAssessmentDto,
  createAssessmentDto,
} from '@dtos/assessment.dto'
import AssessmentService from 'app/services/assessment.service'
import RedisService from 'common/cache/service/redis.service'
import TestService from 'app/services/test.service'
import TopicService from 'app/services/topic.service'

@JsonController('/assessments')
@Service()
export class AssessmentController extends BaseController {
  constructor(
    protected assessmentRepository: AssessmentRepository,
    protected assessmentService: AssessmentService,
    protected redisService: RedisService,
    protected testService: TestService,
    protected topicService: TopicService,
  ) {
    super()
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @UseBefore(validationMiddleware(GetListAssessmentDto, 'query'))
  @Get('/list')
  async getListAssessments(@Req() req: any, @Res() res: any, @QueryParam('status') status: number) {
    try {
      const user = req.user
      const findAllAssessmentsData = await this.assessmentRepository.findByOptionals({
        where: {
          user_id: user.id,
          status: status,
        },
      })
      return this.setCode(200)
        .setData({
          assessments: findAllAssessmentsData,
        })
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Post('/status')
  async getAssessmentsByStatus(@Req() req: any, @Res() res: any) {
    try {
      const assessmentData = await this.assessmentRepository.findByStatus(req.body.status)
      return this.setData(assessmentData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @UseBefore(validationMiddleware(createAssessmentDto, 'body'))
  @Post('/create')
  async createAssessment(@Req() req: any, @Res() res: any) {
    try {
      const user = req.user
      const assessmentTestRepository = new AssessmentTestRepository(AssessmentTest)
      const hrTestRepository = new HrTestRepository(HrTest)
      const tests = req.body.game
      const testIdArr = tests.map((i) => i.game_id)
      const hrTest = await hrTestRepository.findHrTestByUser(user.id)
      const arrayTest = hrTest.map((i) => i.test_id)
      if (!arraysTestInclude(arrayTest, testIdArr)) {
        throw new ForbiddenError('Hr do not have permission')
      }
      const assessmentCreate = { ...req.body, user_id: user.id }
      const assessmentData = await this.assessmentRepository.createAssessment(assessmentCreate)
      const assessment_id = assessmentData.id
      const promiseAssessmentTest = testIdArr.map(async (test) => {
        const asssessmentTest = await assessmentTestRepository.createAssessmentTest({
          assessment_id: assessment_id,
          test_id: test,
        })
        return asssessmentTest
      })
      const assessmentTestData = await Promise.all(promiseAssessmentTest)
      return this.setData({ assessmentData, assessmentTestData })
        .setCode(200)
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Put('/update/:id')
  async updateAssessment(@Req() req: any, @Res() res: any) {
    try {
      if (!req.body.name) {
        throw new BadRequestError('Assessment name cannot be empty')
      }
      const update = await this.assessmentRepository.updateAssessment(req.body, req.params.id)
      return this.setData(update).setCode(200).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Put('/updateStatus/:id')
  async updateAssessmentStatus(@Req() req: any, @Res() res: any) {
    try {
      if (!req.body.status) {
        throw new BadRequestError('Assessment status cannot be empty')
      }
      const update = await this.assessmentRepository.updateStatusAssessment(req.body, req.params.id)
      return this.setData(update).setCode(200).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Delete('/delete/:id')
  async deleteAssessment(@Req() req: any, @Res() res: any) {
    try {
      const deleteAssessment = await this.assessmentRepository.deleteAssessment(req.params.id)
      return this.setData(deleteAssessment).setCode(200).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Post('/candidate-login')
  @UseBefore(validationMiddleware(CandidateLoginDto, 'body'))
  async accessAssessment(
    @Body() body: CandidateLoginDto,
    @Res() res: any,
    @QueryParam('sub_link') sub_link: string,
  ) {
    try {
      const { email } = body
      const invitedRepository = new InvitedRepository(Invited)
      const userRepository = new UserRepository(User)
      const assessmentData = await this.assessmentRepository.findBySubLink(sub_link)
      const listInvited = await invitedRepository.findByOptionals({
        where: {
          assessment_id: assessmentData.id,
        },
        raw: true,
      })
      const invitedEmails = listInvited.map((item) => item.email)
      if (invitedEmails.includes(email)) {
        const user = await userRepository.findOrCreateByCondition({
          where: {
            email: email,
            role: 'candidate',
          },
          raw: true,
        })
        const accessToken = createAccessToken(user[0])
        return this.setCode(200)
          .setData({
            access_token: accessToken,
            email: email,
          })
          .setMessage('Success')
          .responseSuccess(res)
      } else {
        return this.setCode(403)
          .setData({})
          .setMessage('You are not invited to this assessment')
          .responseErrors(res)
      }
    } catch (error) {
      if (error.message == 'Validation error') {
        return this.setCode(error?.status || 500)
          .setData({})
          .setMessage('User have already invited')
          .responseErrors(res)
      }
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(CandidateMiddleware)
  @Post('/candidate/finish-game')
  async finishGame(@Req() req: any, @Res() res: any) {
    try {
      const score = await this.assessmentService.getScore(req, req.body.game_id)
      return this.setData({
        score,
      })
        .setCode(200)
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(CandidateMiddleware)
  @Post('/candidate/:sub_link/:test_id/answer')
  async getResult(@Req() req: any, @Res() res: any) {
    try {
      const responseData = await this.assessmentService.answerQuestion(req)

      return this.setCode(200).setData(responseData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(CandidateMiddleware)
  @Get('/candidate/:sub_link/:test_id')
  async getTestTopic(@Req() req: any, @Res() res: any) {
    try {
      const responseData = await this.assessmentService.generateTopic(req)
      return this.setCode(200).setData(responseData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      console.log(error)
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(AuthMiddleware)
  @Get('/candidate/:sub_link')
  async getAssessmentTests(@Req() req: any, @Res() res: any) {
    try {
      const { user } = req
      const assessmentTestRepository = new AssessmentTestRepository(AssessmentTest)
      const assessmentData = await this.assessmentRepository.findBySubLink(req.params.sub_link)
      const assessmentTestsData = await assessmentTestRepository.findAssessmentTestByAssessment(
        assessmentData.id,
      )

      const userTest = await this.redisService.lrange(user.mail + 'test', 0, -1)

      console.log(userTest)

      if (userTest.length > 0) {
        const testCacheArray = userTest.map((test) => {
          return JSON.parse(test)
        })
        const testArray = assessmentTestsData.map((item) => {
          const testCache = testCacheArray.find((testItem) => testItem.test_id === item['test.id'])
          const test = {
            id: item['test.id'],
            name: item['test.name'],
            image_cover: item['test.image_cover'],
            time: item['test.time'],
            score: item['test.score'],
            description: item['test.description'],
            status: testCache.status,
            status_text: testCache.status_text,
          }
          return test
        })
        return this.setCode(200).setData(testArray).setMessage('Success').responseSuccess(res)
      }
      const storeUserTset = assessmentTestsData.map(async (item) => {
        return this.redisService.lpush(
          user.mail + 'test',
          JSON.stringify({
            test_id: item['test.id'],
            status: 1,
            status_text: 'Not started',
          }),
        )
      })
      await Promise.all(storeUserTset)
      const testArray = assessmentTestsData.map((item) => {
        const test = {
          id: item['test.id'],
          name: item['test.name'],
          image_cover: item['test.image_cover'],
          time: item['test.time'],
          score: item['test.score'],
          description: item['test.description'],
          status: 1,
          status_text: 'Not started',
        }
        return test
      })
      return this.setCode(200).setData(testArray).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Get('/:id/result')
  async getAssesmentResult(@Req() req: any, @Res() res: any) {
    try {
      const resultRepository = new ResultRepository(Result)
      const results = await resultRepository.findResultByAssessment(req.params.id)
      if (!results) {
        throw new BadRequestError('No result has been created on this assessment')
      }
      return this.setCode(200).setData(results).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Post('/get-info-assessment')
  @UseBefore(validationMiddleware(GetInfoAssessmentDto, 'body'))
  async getAssessmentInfo(@Body() body: GetInfoAssessmentDto, @Res() res: any) {
    const assessmentInfo = await this.assessmentService.getInfoAssessment(body.sub_link)
    return this.setData(assessmentInfo).setMessage('Success').responseSuccess(res)
  }

  @Authorized()
  @UseBefore(AuthMiddleware)
  @Get('/:id')
  async getAssessment(@Req() req: any, @Res() res: any) {
    try {
      const assessmentData = await this.assessmentRepository.getAssessmentWithGameById(
        req.params.id,
      )
      assessmentData.games = assessmentData.assessmentTests.map((i) => {
        return i.test
      })

      return this.setData({ assessment: assessmentData }).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }
}

export default AssessmentController
