import User from '@models/entities/user.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { UserRepositoryInterface } from './interfaces/user.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import { createUserDto } from '@dtos/user.dto'

@Service({ global: true })
class UserRepository extends BaseRepository<User> implements UserRepositoryInterface<User> {
  constructor(@ModelContainer(User.tableName) User: ModelCtor<User>) {
    super(User)
  }

  async findByEmail(email: string): Promise<User> {
    return this.findByCondition({
      where: { email: email },
      raw: true,
    })
  }

  async find(id: number): Promise<User> {
    return this.findById(id)
  }

  async findAll(): Promise<User[]> {
    return this.getAll()
  }

  async createHr(createUserDto: createUserDto): Promise<User> {
    return this.create(createUserDto)
  }

  async findOrCreateUser(email: string): Promise<[User, boolean]> {
    return this.findOrCreateByCondition({
      where: {
        email: email,
        role: 'candidate',
      },
      raw: true,
    })
  }
}

export default UserRepository
