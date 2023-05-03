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

@Table({
  tableName: 'inviteds',
})
export default class Invited extends Model<Invited> {
  @PrimaryKey
  @ForeignKey(() => Assessment)
  @Column
  assessment_id!: number

  @BelongsTo(() => Assessment, {
    onDelete: 'CASADE',
  })
  assessment!: Assessment

  @PrimaryKey
  @Column
  email: string

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { Invited }
