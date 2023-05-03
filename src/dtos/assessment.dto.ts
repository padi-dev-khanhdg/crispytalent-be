import { Expose, Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class createAssessmentGameDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  game_id: number
}

export class GetListAssessmentDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status: number
}

export class createAssessmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsNotEmpty()
  game: createAssessmentGameDto[]

  @Expose()
  @IsString()
  @IsNotEmpty()
  job_function: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  job_position: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  start_date: Date

  @Expose()
  @IsString()
  @IsNotEmpty()
  end_date: Date
}

export class updateAssessmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string

  @Expose()
  @IsDate()
  @IsOptional()
  start_at: Date

  @Expose()
  @IsDate()
  @IsOptional()
  end_at: Date
}

export class updateStatusAssessmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  status: string
}

export class updateSubLinkAssessmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  sub_link: string
}

export class GetInfoAssessmentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  sub_link: string
}

export class CandidateLoginDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  email: string
}
