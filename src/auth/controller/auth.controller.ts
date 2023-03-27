import { Body, Controller, Post } from '@nestjs/common';
import { LogInDto, RegisterDto } from '../dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  registerLocal(@Body() dto: RegisterDto) {
    this.authService.registerLocal(dto);
  }

  @Post('local/logIn')
  logInLocal(@Body() dto: LogInDto) {
    this.authService.logInLocal(dto);
  }

  @Post('logOut')
  logOut() {
    this.authService.logOut();
  }

  @Post('refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
