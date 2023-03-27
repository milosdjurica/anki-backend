import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Src/prisma/prisma.service';
import { LogInDto, RegisterDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  registerLocal(dto: RegisterDto) {}

  logInLocal(dto: LogInDto) {}

  logOut() {}

  refreshTokens() {}
}
