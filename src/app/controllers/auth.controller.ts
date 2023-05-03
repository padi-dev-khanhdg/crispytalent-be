import { NextFunction, Response, Request } from 'express'
import { LoginDto } from '../../dtos/auth.dto'
import UserRepository from '@repositories/user.repository'
import { BaseController } from './base.controller'
import { BadRequestError, JsonController, Post, Req, Res } from 'routing-controllers'
import { Service } from 'typedi'
import { createAccessToken } from '@utils/token'
import { compare } from '@utils/bcrypt'
import RedisService from 'common/cache/service/redis.service'

@JsonController('/auth')
@Service()
class AuthController extends BaseController {
  constructor(protected authRepository: UserRepository, protected redisService: RedisService) {
    super()
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    try {
      const loginDto: LoginDto = req.body
      const { email, password } = loginDto
      const user = await this.authRepository.findByEmail(email)
      if (!user) {
        this.setData({})
        throw new BadRequestError('No user with email created')
      }
      const isPasswordTrue = compare(password, user.password)
      if (isPasswordTrue) {
        const accessToken = createAccessToken(user)
        return this.setData({
          access_token: accessToken,
          email: email,
        })
          .setCode(200)
          .setMessage('Success')
          .responseSuccess(res)
      } else {
        return this.setData({}).setCode(500).setMessage('Wrong password').responseErrors(res)
      }
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.setData({}).setCode(200).setMessage('Success').responseSuccess(res)
  }
}

export default AuthController
