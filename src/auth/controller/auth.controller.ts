import { Body, Controller, Post } from '@nestjs/common';
import { LogInDto, RegisterDto } from '../dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  registerLocal(@Body() registerDto: RegisterDto) {
    return this.authService.registerLocal(registerDto);
  }

  @Post('local/logIn')
  logInLocal(@Body() logInDto: LogInDto) {
    return this.authService.logInLocal(logInDto);
  }

  @Post('logOut')
  logOut() {
    return this.authService.logOut();
  }

  @Post('refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
