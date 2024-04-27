import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard, RequestWithUser } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('verify')
  @HttpCode(200)
  validateToken(@Req() request: RequestWithUser) {
    return { user: request.user, token: this.authService.refreshToken(request.user) };
  }

  @UseGuards(AuthGuard)
  @Get('upgrade')
  @HttpCode(200)
  upgradeToPremium(@Req() request: RequestWithUser) {
    return this.authService.upgradeToPremium(request.user);
  }
}
