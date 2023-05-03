import { NextFunction, Response, Request } from 'express'
import TestRepository from '@repositories/test.repository'
import { BaseController } from './base.controller'
import { JsonController, UseBefore, Authorized, Get, Req, Res } from 'routing-controllers'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/hr.middleware'

@JsonController('/tests')
@Service()
class TestController extends BaseController {
  constructor(protected TestRepository: TestRepository) {
    super()
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Get('/all')
  async getAllTest(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const tests = await this.TestRepository.getAllTest()
      return this.setCode(200)
        .setData({
          games: tests,
        })
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      console.log(error)
      return this.setCode(error?.status || 500)
        .setData({})
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }
}

export default TestController
