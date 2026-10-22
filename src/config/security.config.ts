import { randomBytes } from 'node:crypto';

type Environment = NodeJS.ProcessEnv;

export function resolveJwtSecret(environment: Environment = process.env): string {
  const configured = environment.JWT_SECRET?.trim();
  if (configured) {
    if (configured.length < 32) {
      throw new Error('JWT_SECRET must contain at least 32 characters');
    }
    return configured;
  }

  if (environment.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }

  return randomBytes(32).toString('hex');
}

export function resolveCorsOrigins(
  environment: Environment = process.env,
): string[] {
  const configured = environment.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!configured?.length) {
    if (environment.NODE_ENV === 'production') {
      throw new Error('CORS_ORIGINS must be configured in production');
    }
    return ['http://localhost:5173'];
  }

  return configured.map((origin) => {
    if (origin === '*') {
      throw new Error('CORS_ORIGINS cannot contain wildcard origins');
    }
    let url: URL;
    try {
      url = new URL(origin);
    } catch {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
    return url.origin;
  });
}

export function isCorsOriginAllowed(
  requestOrigin: string | undefined,
  allowedOrigins: readonly string[],
): boolean {
  return requestOrigin === undefined || allowedOrigins.includes(requestOrigin);
}
