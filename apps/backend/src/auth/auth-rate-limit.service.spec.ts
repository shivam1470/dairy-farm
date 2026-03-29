/* eslint-env jest */

import { HttpException } from '@nestjs/common';
import { AuthRateLimitService } from './auth-rate-limit.service';

describe('AuthRateLimitService', () => {
  let service: AuthRateLimitService;

  beforeEach(() => {
    service = new AuthRateLimitService();
  });

  it('blocks repeated requests inside the same window', () => {
    for (let i = 0; i < 10; i += 1) {
      service.checkRequestLimit('127.0.0.1:POST:/auth/login', 10, 60_000);
    }

    expect(() =>
      service.checkRequestLimit('127.0.0.1:POST:/auth/login', 10, 60_000),
    ).toThrow(HttpException);
  });

  it('blocks after repeated failed logins until success or cooldown', () => {
    for (let i = 0; i < 5; i += 1) {
      service.recordLoginFailure('farmer@example.com:127.0.0.1');
    }

    expect(() =>
      service.assertLoginAllowed('farmer@example.com:127.0.0.1'),
    ).toThrow(HttpException);
  });

  it('clears failure state after a successful login', () => {
    for (let i = 0; i < 5; i += 1) {
      service.recordLoginFailure('farmer@example.com:127.0.0.1');
    }

    service.clearLoginFailures('farmer@example.com:127.0.0.1');

    expect(() =>
      service.assertLoginAllowed('farmer@example.com:127.0.0.1'),
    ).not.toThrow();
  });
});
