import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '@Src/auth/dto';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    return dto;
  }
}
