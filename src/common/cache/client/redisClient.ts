import { createClient } from 'redis'
import { logger } from '@utils/logger'
import { env } from '@env'

export const redisClient = createClient()

redisClient.on('connect', () => {
  ;`Redis client connected on port ${env.cache.redis}!`
})

redisClient.on('error', (err: any) => {
  logger.error(`Connect redis error: ${err?.message}`)
})
