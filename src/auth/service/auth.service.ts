import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@Src/prisma/prisma.service';
import { LogInDto, RegisterDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // !REGISTER
  async registerLocal(registerDto: RegisterDto): Promise<Tokens> {
    const usernameTaken = await this.prisma.user.findUnique({
      where: {
        username: registerDto.username,
      },
    });

    if (usernameTaken)
      throw new HttpException(
        'Username is already taken! Please provide another one.',
        HttpStatus.BAD_REQUEST,
      );

    const hashPassword = await this.hashData(registerDto.password);
    delete registerDto.confirmPassword;
    delete registerDto.password;

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

  // !LOG IN
  async logInLocal(logInDto: LogInDto): Promise<Tokens> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: logInDto.username,
      },
    });

    if (!foundUser) throw new ForbiddenException('Username not found!');

    const passwordMatches = await bcrypt.compare(
      logInDto.password,
      foundUser.hashPassword,
    );

    if (!passwordMatches)
      throw new ForbiddenException('Wrong username/password');

    const tokens = await this.getTokens(foundUser.userId, foundUser.username);
    await this.updateRtHash(foundUser.userId, tokens.refreshToken);
    return tokens;
  }

  // !LOG OUT
  async logOut(userId: number) {
    // !updateMany because in basic update function cannot access hashedRt
    const user = await this.prisma.user.updateMany({
      where: {
        userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    if (user.count === 0)
      return {
        success: false,
        msg: 'Something went wrong! User is already logged out!',
      };

    // !2nd option is to return user object that just logged out
    return {
      success: true,
      msg: `User is successfully logged out!`,
    };
  }

  // ! REFRESH TOKENS
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) throw new ForbiddenException('User not found!');

    if (!user.hashedRt)
      throw new ForbiddenException('Access denied! You are already logged out');

    const rtMatches = bcrypt.compare(refreshToken, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Token is not valid!');

    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateRtHash(user.userId, tokens.refreshToken);
    return tokens;
  }

  // ! UPDATE REFRESH TOKEN HASH
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
