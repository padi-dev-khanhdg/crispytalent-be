import { Expose } from 'class-transformer'
import { Allow, IsNotEmpty, IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string
}
