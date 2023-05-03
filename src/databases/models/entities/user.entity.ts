import {
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  AutoIncrement,
} from 'sequelize-typescript'

@Table({
  tableName: 'users',
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  email!: string

  @Column
  password!: string

  @Column
  name!: string

  @Column
  role!: string

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { User }
