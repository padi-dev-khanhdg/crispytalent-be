export interface SetCacheMessage {
  message: string
  status: string
}

abstract class BaseCacheService<Type> {
  protected client: Type

  abstract set(key: string, value: string, expiresTime: number): Promise<SetCacheMessage>

  abstract get(key: string): Promise<any>

  abstract delete(key: string): Promise<number | boolean>
}

export default BaseCacheService
