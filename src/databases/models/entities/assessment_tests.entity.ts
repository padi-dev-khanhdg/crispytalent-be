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

@Table({
  tableName: 'assessment_tests',
})
export default class AssessmentTest extends Model<AssessmentTest> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @ForeignKey(() => Assessment)
  @Column
  assessment_id!: number

  @BelongsTo(() => Assessment, {
    onDelete: 'CASADE',
  })
  assessment!: Assessment

  @ForeignKey(() => Test)
  @Column
  test_id!: number

  @BelongsTo(() => Test, {
    onDelete: 'CASADE',
  })
  test!: Test

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { AssessmentTest }
