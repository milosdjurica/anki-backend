import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  lastName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  confirmPassword: string;
}
