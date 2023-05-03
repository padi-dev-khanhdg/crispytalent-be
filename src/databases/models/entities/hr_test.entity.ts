import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript'
import User from './user.entity'
import Test from './test.entity'

@Table({
  tableName: 'hr_tests',
})
export default class HrTest extends Model<HrTest> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @ForeignKey(() => User)
  @Column
  user_id!: number

  @BelongsTo(() => User, 'user_id')
  user!: User

  @ForeignKey(() => Test)
  @Column
  test_id!: number

  @BelongsTo(() => Test, 'test_id')
  test!: Test

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { HrTest }
