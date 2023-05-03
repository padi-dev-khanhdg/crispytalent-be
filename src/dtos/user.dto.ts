import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class createUserDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Expose()
  @IsString()
  @IsOptional()
  name: string

  @Expose()
  @IsString()
  @IsOptional()
  password: string

  @Expose()
  @IsString()
  @IsOptional()
  role: string
}
