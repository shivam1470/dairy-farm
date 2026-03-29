import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
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
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(AuthRateLimitGuard)
  @ApiCreatedResponse({ type: AuthResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthRateLimitGuard)
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto, @Request() req: ExpressRequest) {
    return this.authService.login(dto, req.ip);
  }

  @Post('google')
  @UseGuards(AuthRateLimitGuard)
  @ApiOkResponse({ type: AuthOnboardingResponseDto })
  loginWithGoogle(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto);
  }

  @Post('google/complete-signup')
  @UseGuards(AuthRateLimitGuard)
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
