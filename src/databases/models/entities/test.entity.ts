import {
  Column,
  CreatedAt,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'tests',
})
export default class Test extends Model<Test> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  name!: string

  @Column
  description!: string

  @Default(0)
  @Column
  time!: number

  @Column
  image_cover!: string

  @Column
  score!: number

  @CreatedAt
  @Column
  created_at!: Date

  @UpdatedAt
  @Column
  updated_at!: Date
}

export { Test }
