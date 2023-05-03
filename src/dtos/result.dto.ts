import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class createResultDto {
  @Expose()
  @IsString()
  @IsOptional()
  score: number

  @Expose()
  @IsString()
  @IsOptional()
  note: string

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  assessment_id: number

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  test_id: number

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  user_id: number
}
