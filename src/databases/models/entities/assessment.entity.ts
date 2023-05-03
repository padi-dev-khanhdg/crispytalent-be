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
  Default,
  HasMany,
  DataType,
} from 'sequelize-typescript'
import User from './user.entity'
import AssessmentTest from './assessment_tests.entity'
import Test from './test.entity'
import { VIRTUAL } from 'sequelize'

@Table({
  tableName: 'assessments',
})
export default class Assessment extends Model<Assessment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @Column
  name: string

  @ForeignKey(() => User)
  @Column
  user_id!: number

  @BelongsTo(() => User, {
    onDelete: 'CASADE',
  })
  user!: User

  @Column
  status: boolean

  @Column
  sub_link: string

  @Column
  job_function: string

  @Column
  job_position: string

  @Column
  start_date: string

  @Column
  end_date: string

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date

  @HasMany(() => AssessmentTest, 'assessment_id')
  assessmentTests: AssessmentTest[]

  @Column(DataType.VIRTUAL)
  games: Test[]
}

export { Assessment }
