import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthRateLimitService } from '../auth-rate-limit.service';

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  constructor(private authRateLimitService: AuthRateLimitService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.socket?.remoteAddress || 'unknown';
    const routeKey = `${request.method}:${request.route?.path ?? request.path ?? 'auth'}`;

    this.authRateLimitService.checkRequestLimit(
      `${ip}:${routeKey}`,
      10,
      5 * 60 * 1000,
    );

    return true;
  }
}
