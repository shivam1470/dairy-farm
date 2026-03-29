import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type FixedWindowEntry = {
  count: number;
  resetAt: number;
};

type FailureEntry = {
  count: number;
  blockedUntil?: number;
};

@Injectable()
export class AuthRateLimitService {
  private readonly requestWindows = new Map<string, FixedWindowEntry>();
  private readonly loginFailures = new Map<string, FailureEntry>();

  checkRequestLimit(
    key: string,
    limit: number,
    windowMs: number,
    message = 'Too many authentication attempts. Please try again later.',
  ) {
    const now = Date.now();
    const current = this.requestWindows.get(key);

    if (!current || current.resetAt <= now) {
      this.requestWindows.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (current.count >= limit) {
      throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
  }

  assertLoginAllowed(key: string) {
    const now = Date.now();
    const failureEntry = this.loginFailures.get(key);

    if (failureEntry?.blockedUntil && failureEntry.blockedUntil > now) {
      throw new HttpException(
        'Too many failed login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (failureEntry?.blockedUntil && failureEntry.blockedUntil <= now) {
      this.loginFailures.delete(key);
    }
  }

  recordLoginFailure(key: string) {
    const now = Date.now();
    const current = this.loginFailures.get(key);
    const nextCount = (current?.count ?? 0) + 1;

    this.loginFailures.set(key, {
      count: nextCount,
      blockedUntil: nextCount >= 5 ? now + 15 * 60 * 1000 : current?.blockedUntil,
    });
  }

  clearLoginFailures(key: string) {
    this.loginFailures.delete(key);
  }
}
