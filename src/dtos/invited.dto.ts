import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator'

export class CreateInvitedDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  assessment_id: number

  @Expose()
  @IsString({ each: true })
  @IsNotEmpty()
  list_email: string[]

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  type: number
}

export class CheckEmailDto {
  @Expose()
  @IsNotEmpty()
  @IsString({ each: true })
  list_email: string[]

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  assessment_id: number

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  type: number
}
