import 'reflect-metadata'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import DB from '@models/index'
import { logger, stream } from '@utils/logger'
import { useExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import path from 'path'
import errorMiddleware from '@middlewares/error.middleware'
import { env } from '@env'
import { Action } from 'routing-controllers'
import { verifyToken } from '@utils/token'
import { redisClient } from 'common/cache/client'

class App {
  public app: express.Application = express()
  public env: string
  public port: string | number

  constructor() {
    this.env = env.node || 'development'
    this.port = env.app.port || 3000

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    // this.register404Page();
    this.connectToRedis()
  }

  public listen() {
    this.app.listen(this.port, async () => {
      logger.info(`=================================`)
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private connectToDatabase() {
    DB.sequelize.authenticate()
    // DB.sequelize.sync({ force: false });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(env.log.format, { stream }))
    this.app.use(cors({ origin: env.cors.origin, credentials: env.cors.credentials }))
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, '/public')))
  }

  private initializeRoutes() {
    useContainer(Container)
    useExpressServer(this.app, {
      plainToClassTransformOptions: {
        excludeExtraneousValues: true,
      },
      validation: true,
      authorizationChecker: async (action: Action, roles: string[]) => {
        try {
          const token = action.request.headers['authorization'].split(' ')[1]
          await verifyToken(token)
          return true
        } catch (err: any) {
          return false
        }
      },
      defaultErrorHandler: false,
      routePrefix: '/api',
      middlewares: [path.join(__dirname, '/app/middleware/*.ts')],
      controllers: [path.join(__dirname, '/app/controllers/*.ts')],
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
  private async connectToRedis() {
    await redisClient.connect()
  }
}

export default App
