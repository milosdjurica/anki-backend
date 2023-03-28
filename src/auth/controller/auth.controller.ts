import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '@Src/common/decorators';
import { RtGuard } from '@Src/common/guards';
import { PasswordValidationPipe } from '@Src/common/pipes';
import { LogInDto, RegisterDto } from '../dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/register')
  @UsePipes(new PasswordValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  registerLocal(@Body() registerDto: RegisterDto) {
    return this.authService.registerLocal(registerDto);
  }

  @Public()
  @Post('local/logIn')
  @HttpCode(HttpStatus.OK)
  logInLocal(@Body() logInDto: LogInDto) {
    return this.authService.logInLocal(logInDto);
  }

  @Post('logOut')
  @HttpCode(HttpStatus.OK)
  logOut(@GetCurrentUserId() userId: number) {
    return this.authService.logOut(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
