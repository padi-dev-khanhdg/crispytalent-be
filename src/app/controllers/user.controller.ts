import { Get, JsonController, Authorized, Req, Res, Post, UseBefore } from 'routing-controllers'
import { NextFunction, Response } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { hash } from '@utils/bcrypt'
import UserRepository from '@repositories/user.repository'
import HrTestRepository from '@repositories/hr_test.repository'
import HrTest from '@models/entities/hr_test.entity'
import { AdminMiddleware } from '@middlewares/admin.middleware'
import { HrMiddleware } from '@middlewares/hr.middleware'

@JsonController('/users')
@Service()
export class UsersController extends BaseController {
  constructor(protected userRepository: UserRepository) {
    super()
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Get('/list')
  async getListUsers(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const findAllUsersData = await this.userRepository.findAll()
      return this.setData(findAllUsersData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Post('/getByEmail')
  async getUserByEmail(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const userData = await this.userRepository.findByEmail(req.body.email)
      return this.setData(userData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(AdminMiddleware)
  @Post('/createHr')
  async createHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const hrTestRepository = new HrTestRepository(HrTest)
      const { email, name, password, role } = req.body.user
      const tests = req.body.tests
      const hashedPassword = hash(password)
      const userData = await this.userRepository.createHr({
        email: email,
        name: name,
        password: hashedPassword,
        role: role,
      })
      const user_id = userData.id
      const promiseHrTest = tests.map(async (test) => {
        const hrTest = await hrTestRepository.createHrtest({
          user_id: user_id,
          test_id: test,
        })
        return hrTest
      })
      const hrTestDatas = await Promise.all(promiseHrTest)
      return this.setData({ userData, hrTestDatas }).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @Get('/:id')
  async getUser(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const userData = await this.userRepository.find(req.params.id)
      return this.setData(userData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}

export default UsersController
