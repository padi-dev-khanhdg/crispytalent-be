import { Response } from 'express'
import { BaseController } from './base.controller'
import { JsonController, Post, Res, UseBefore, Body, Authorized, Req } from 'routing-controllers'
import { Service } from 'typedi'
import InvitedService from 'app/services/invited.service'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { CheckEmailDto, CreateInvitedDto } from '@dtos/invited.dto'
import { HrMiddleware } from '@middlewares/hr.middleware'

@JsonController('/invited')
@Service()
class InvitedController extends BaseController {
  constructor(protected invitedService: InvitedService) {
    super()
  }

  @UseBefore(AuthMiddleware)
  @UseBefore(validationMiddleware(CheckEmailDto, 'body'))
  @Post('/check-email')
  async checkEmail(@Body() body: CheckEmailDto, @Res() res: Response) {
    try {
      const isInvited = await this.invitedService.checkEmail(body)
      const error_emails: any = []
      if (!isInvited) {
        error_emails.push('Email invited')
        return this.setCode(400).setMessage('Email invited').responseErrors(res)
      }
      return this.setData({ error_emails }).setCode(200).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setCode(error?.status || 500)
        .setMessage(error?.message || 'Internal server error')
        .responseErrors(res)
    }
  }

  @Authorized()
  @UseBefore(HrMiddleware)
  @UseBefore(validationMiddleware(CreateInvitedDto, 'body'))
  @Post('/inviteCandidate')
  async inviteCandidate(@Body() body: CreateInvitedDto, @Req() req: any, @Res() res: any) {
    try {
      const { inviteds, invitedLink } = await this.invitedService.inviteCandidate(body)
      return this.setData({
        inviteds,
        invitedLink,
      })
        .setCode(200)
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

export default InvitedController
