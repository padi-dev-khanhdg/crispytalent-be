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
import Assessment from './assessment.entity'
import Test from './test.entity'
import User from './user.entity'

@Table({
  tableName: 'results',
})
export default class Result extends Model<Result> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  score!: number

  @Column
  note!: string

  @Column
  user_email!: string

  @Column
  test_name!: string

  @Column
  assessment_name!: string

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { Result }
