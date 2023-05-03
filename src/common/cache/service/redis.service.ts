import { Service } from 'typedi'
import BaseCacheService from './baseCacheService.service'
import { redisClient } from '../client'
import { createClient } from 'redis'

export type RedisClientType = ReturnType<typeof createClient>

@Service()
class RedisService extends BaseCacheService<RedisClientType> {
  protected client: RedisClientType

  constructor(client: RedisClientType = redisClient) {
    super()
    this.client = client
  }

  async set(key: string, value: any, expiresTime: number) {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: expiresTime,
      })
      return {
        message: 'Cache successfully',
        status: 'success',
      }
    } catch (err: any) {
      return {
        message: 'Cache failed',
        status: 'fail',
      }
    }
  }

  async get(key: string) {
    return JSON.parse(await this.client.get(key))
  }

  async delete(key: string) {
    return this.client.del(key)
  }

  async lpush(key: string, value: any) {
    return this.client.lPush(key, value)
  }

  async lrange(key: string, start: number, stop: number) {
    return this.client.lRange(key, start, stop)
  }
}

export default RedisService
