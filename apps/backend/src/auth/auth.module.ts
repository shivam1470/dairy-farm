import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthRateLimitService } from './auth-rate-limit.service';
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';
import { getJwtSecret } from './auth.config';

const jwtSecret = getJwtSecret();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    AuthRateLimitService,
    AuthRateLimitGuard,
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
