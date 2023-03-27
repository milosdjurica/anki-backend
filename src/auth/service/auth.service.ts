import { Injectable } from '@nestjs/common';
import { PrismaService } from '@Src/prisma/prisma.service';
import { LogInDto, RegisterDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async registerLocal(registerDto: RegisterDto): Promise<Tokens> {
    const hashPassword = await this.hashData(registerDto.password);
    delete registerDto.confirmPassword;
    delete registerDto.password
    const newUser = await this.prisma.user.create({
      data: {
        hashPassword,
        ...registerDto,
      },
    });

    //! after getting the tokens, update refresh token in database
    const tokens = await this.getTokens(newUser.userId, newUser.username);
    await this.updateRtHash(newUser.userId, tokens.refreshToken);
    return tokens;
  }

  logInLocal(logInDto: LogInDto) {}

  logOut() {}

  refreshTokens() {}

  async updateRtHash(userId: number, refreshToken: string) {
    const hashedRt = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        hashedRt,
      },
    });
  }

  //! HELPER FUNCTIONS

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '60m',
          secret: process.env.AT_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '5d',
          secret: process.env.RT_SECRET,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
