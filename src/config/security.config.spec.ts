import {
  isCorsOriginAllowed,
  resolveCorsOrigins,
  resolveJwtSecret,
} from './security.config';

describe('security configuration', () => {
  it('fails production startup when JWT_SECRET is absent or weak', () => {
    expect(() => resolveJwtSecret({ NODE_ENV: 'production' })).toThrow(
      'JWT_SECRET must be configured in production',
    );
    expect(() =>
      resolveJwtSecret({ NODE_ENV: 'production', JWT_SECRET: 'short' }),
    ).toThrow('JWT_SECRET must contain at least 32 characters');
  });

  it('uses a non-static ephemeral secret outside production', () => {
    const first = resolveJwtSecret({ NODE_ENV: 'test' });
    const second = resolveJwtSecret({ NODE_ENV: 'test' });
    expect(first).toHaveLength(64);
    expect(second).not.toBe(first);
  });

  it('accepts only configured browser origins', () => {
    const allowed = resolveCorsOrigins({
      NODE_ENV: 'production',
      CORS_ORIGINS: 'https://app.example.com,https://admin.example.com',
    });
    expect(isCorsOriginAllowed('https://app.example.com', allowed)).toBe(true);
    expect(isCorsOriginAllowed('https://evil.example.com', allowed)).toBe(false);
    expect(isCorsOriginAllowed(undefined, allowed)).toBe(true);
  });

  it('rejects wildcard, malformed and missing production origins', () => {
    expect(() =>
      resolveCorsOrigins({ NODE_ENV: 'production', CORS_ORIGINS: '*' }),
    ).toThrow('wildcard');
    expect(() =>
      resolveCorsOrigins({ NODE_ENV: 'production', CORS_ORIGINS: 'example.com' }),
    ).toThrow('Invalid CORS origin');
    expect(() => resolveCorsOrigins({ NODE_ENV: 'production' })).toThrow(
      'CORS_ORIGINS must be configured in production',
    );
  });
});
