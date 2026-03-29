import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  CompleteGoogleSignupDto,
  GoogleAuthDto,
  RegisterDto,
  LoginDto,
} from './dto/auth.dto';
import {
  AuthOnboardingResponseDto,
  AuthResponseDto,
  AuthUserDto,
} from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('google')
  @ApiOkResponse({ type: AuthOnboardingResponseDto })
  loginWithGoogle(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto);
  }

  @Post('google/complete-signup')
  @ApiCreatedResponse({ type: AuthResponseDto })
  completeGoogleSignup(@Body() dto: CompleteGoogleSignupDto) {
    return this.authService.completeGoogleSignup(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOkResponse({ type: AuthUserDto })
  getProfile(@Request() req) {
    return req.user;
  }
}
