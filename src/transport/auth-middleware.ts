/**
 * Bearer token authentication middleware for HTTP/SSE transport.
 * Validates NOWAIKIT_API_KEY when set; skips auth in dev mode (no key configured).
 */
import type { IncomingMessage, ServerResponse } from 'http';

export interface AuthRequest extends IncomingMessage {
  authenticated?: boolean;
}

/**
 * Express-compatible middleware that validates Bearer tokens.
 * If NOWAIKIT_API_KEY is not set, all requests pass through (dev mode).
 */
export function authMiddleware(req: AuthRequest, res: ServerResponse, next: () => void): void {
  const apiKey = process.env.NOWAIKIT_API_KEY;

  // No API key configured — dev mode, skip auth
  if (!apiKey) {
    req.authenticated = true;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing or invalid Authorization header. Use: Bearer <NOWAIKIT_API_KEY>' }));
    return;
  }

  const token = authHeader.slice(7);
  if (token !== apiKey) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid API key' }));
    return;
  }

  req.authenticated = true;
  next();
}

/** Check if auth is required (API key is configured). */
export function isAuthRequired(): boolean {
  return !!process.env.NOWAIKIT_API_KEY;
}
