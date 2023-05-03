import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class createAssessmentTestDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  assessment_id: number

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  test_id: number
}
