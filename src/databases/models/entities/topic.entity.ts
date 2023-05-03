import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import Test from './test.entity'

@Table({
  tableName: 'topics',
})
export default class Topic extends Model<Topic> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  question!: string

  @Column
  answer!: string

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

export { Topic }
