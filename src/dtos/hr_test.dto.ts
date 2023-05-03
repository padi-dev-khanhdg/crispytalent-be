import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class createHrTestDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  user_id: number

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  test_id: number
}
