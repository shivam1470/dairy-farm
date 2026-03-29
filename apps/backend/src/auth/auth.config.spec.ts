/* eslint-env jest */

import { getJwtSecret } from './auth.config';

describe('auth config', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  });

  it('returns the configured JWT secret', () => {
    process.env.JWT_SECRET = 'test-secret';

    expect(getJwtSecret()).toBe('test-secret');
  });

  it('throws when JWT secret is missing', () => {
    delete process.env.JWT_SECRET;

    expect(() => getJwtSecret()).toThrow(
      'JWT_SECRET environment variable is required',
    );
  });
});
