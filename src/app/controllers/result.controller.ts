import { NextFunction, Response, Request } from 'express'
import ResultRepository from '@repositories/result.repository'
import { BaseController } from './base.controller'
import {
  BadRequestError,
  JsonController,
  UseBefore,
  Authorized,
  Get,
  Req,
  Res,
} from 'routing-controllers'
import { Service } from 'typedi'
import { AdminMiddleware } from '@middlewares/admin.middleware'
import json2xls from 'json2xls'
import fs from 'fs'
import { env } from '@env'
import random from '@utils/sub_link'

@JsonController('/results')
@Service()
class ResultController extends BaseController {
  constructor(protected resultRepository: ResultRepository) {
    super()
  }

  @Authorized()
  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAllResult(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const results = await this.resultRepository.findAllResult()
      const xls = json2xls(results)
      const randomName = random(10)
      fs.writeFileSync(env.appPath + `/public/downloads/data_${randomName}.xlsx`, xls, 'binary')
      return this.setCode(200)
        .setData({
          results: results,
          dataFile: `data_${randomName}.xlsx`,
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
}

export default ResultController
