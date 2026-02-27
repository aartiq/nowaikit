#!/usr/bin/env node
/**
 * NowAIKit Web Server
 *
 * Zero-dependency Node.js server that:
 * 1. Serves the built renderer/dist/ static files
 * 2. Proxies /api/ai/* requests to AI providers (bypasses CORS)
 *
 * Security:
 * - Binds to localhost only by default (set HOST=0.0.0.0 to expose)
 * - CORS restricted to same-origin (configurable via ALLOWED_ORIGINS)
 * - Requires X-NowAIKit-Proxy header on AI proxy requests (CSRF protection)
 * - Path traversal and null-byte injection protection
 * - Only whitelisted headers forwarded to upstream providers
 * - API keys are never logged
 *
 * Usage:
 *   node serve.js              # default port 4175, localhost only
 *   PORT=3000 node serve.js    # custom port
 *   HOST=0.0.0.0 node serve.js # expose to network (use with caution)
 *   npm run serve              # via package.json script
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = parseInt(process.env.PORT || '4175', 10);
const HOST = process.env.HOST || '127.0.0.1';
const STATIC_DIR = path.join(__dirname, 'renderer', 'dist');

// Configurable allowed origins (comma-separated)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

// ─── MIME types ──────────────────────────────────────────────────────────────

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.map':  'application/json',
};

// ─── AI provider proxy config ────────────────────────────────────────────────

const AI_PROXIES = {
  '/api/ai/anthropic': { target: 'https://api.anthropic.com', strip: '/api/ai/anthropic' },
  '/api/ai/openai':    { target: 'https://api.openai.com',    strip: '/api/ai/openai' },
  '/api/ai/google':    { target: 'https://generativelanguage.googleapis.com', strip: '/api/ai/google' },
  '/api/ai/groq':      { target: 'https://api.groq.com',      strip: '/api/ai/groq' },
  '/api/ai/openrouter': { target: 'https://openrouter.ai',    strip: '/api/ai/openrouter' },
};

// Headers that are safe to forward to upstream AI providers
const ALLOWED_PROXY_HEADERS = new Set([
  'content-type', 'authorization', 'x-api-key', 'anthropic-version',
  'accept', 'accept-encoding', 'user-agent',
]);

// ─── Security helpers ────────────────────────────────────────────────────────

/** Check if an origin is allowed for CORS */
function isAllowedOrigin(origin) {
  if (!origin) return true; // Same-origin requests have no Origin header
  // Always allow same-host requests
  if (origin.startsWith(`http://localhost:${PORT}`) || origin.startsWith(`http://127.0.0.1:${PORT}`)) return true;
  // Allow dev server
  if (origin.startsWith('http://localhost:5173') || origin.startsWith('http://127.0.0.1:5173')) return true;
  // Allow custom configured origins
  return ALLOWED_ORIGINS.includes(origin);
}

/** Strip potential API key patterns from strings (for safe logging) */
function sanitizeForLog(str) {
  if (!str) return str;
  // Redact common API key patterns
  return str
    .replace(/sk-ant-[a-zA-Z0-9_-]+/g, 'sk-ant-***REDACTED***')
    .replace(/sk-[a-zA-Z0-9_-]{20,}/g, 'sk-***REDACTED***')
    .replace(/AIza[a-zA-Z0-9_-]+/g, 'AIza***REDACTED***')
    .replace(/gsk_[a-zA-Z0-9_-]+/g, 'gsk_***REDACTED***')
    .replace(/sk-or-[a-zA-Z0-9_-]+/g, 'sk-or-***REDACTED***')
    .replace(/key=[^&\s]+/g, 'key=***REDACTED***');
}

// ─── Rate limiting (simple per-IP) ──────────────────────────────────────────

const rateLimits = new Map(); // IP -> { count, resetAt }
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '60', 10); // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_WINDOW };
    rateLimits.set(ip, entry);
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// Periodically clean up stale rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(ip);
  }
}, 60000);

// ─── Proxy handler ───────────────────────────────────────────────────────────

function proxyRequest(req, res, proxyConfig) {
  const rewritten = req.url.replace(proxyConfig.strip, '') || '/';
  const target = new URL(rewritten, proxyConfig.target);

  // Collect request body (limit to 10MB)
  const chunks = [];
  let totalSize = 0;
  const MAX_BODY = 10 * 1024 * 1024;

  req.on('data', chunk => {
    totalSize += chunk.length;
    if (totalSize > MAX_BODY) {
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request body too large' }));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', () => {
    if (totalSize > MAX_BODY) return;
    const body = Buffer.concat(chunks);

    // Only forward whitelisted headers
    const headers = { 'host': target.hostname };
    for (const [key, value] of Object.entries(req.headers)) {
      if (ALLOWED_PROXY_HEADERS.has(key.toLowerCase())) {
        headers[key] = value;
      }
    }

    const options = {
      hostname: target.hostname,
      port: 443,
      path: target.pathname + target.search,
      method: req.method,
      headers,
    };

    const origin = req.headers.origin;
    const allowedOrigin = isAllowedOrigin(origin) ? (origin || '*') : '';

    const proxyReq = https.request(options, (proxyRes) => {
      // Set CORS headers for the allowed origin
      if (allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, anthropic-version, X-NowAIKit-Proxy');
      }

      // Forward response headers (skip upstream CORS headers)
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        const lower = key.toLowerCase();
        if (lower.startsWith('access-control-')) continue;
        if (value) res.setHeader(key, value);
      }

      res.writeHead(proxyRes.statusCode || 500);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error(`Proxy error -> ${target.hostname}: ${sanitizeForLog(err.message)}`);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'AI provider unreachable. Check your internet connection.' }));
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
}

// ─── Static file handler ─────────────────────────────────────────────────────

function serveStatic(req, res) {
  // Decode URL and reject null bytes
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  if (urlPath.includes('\0')) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  let filePath = path.resolve(STATIC_DIR, urlPath === '/' ? 'index.html' : '.' + urlPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA fallback: serve index.html for client-side routes
      filePath = path.join(STATIC_DIR, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';

      // Security headers
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      res.end(data);
    });
  });
}

// ─── HTTP server ─────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  const allowed = isAllowedOrigin(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (!allowed) {
      res.writeHead(403);
      res.end('Origin not allowed');
      return;
    }
    res.writeHead(204, {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version, X-NowAIKit-Proxy',
      'Access-Control-Max-Age': '86400',
    });
    res.end();
    return;
  }

  // Check if this is an AI proxy request
  for (const [prefix, config] of Object.entries(AI_PROXIES)) {
    if (req.url.startsWith(prefix)) {
      // CSRF protection: require custom header (browsers can't set this cross-origin without preflight)
      if (!req.headers['x-nowaikit-proxy']) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing X-NowAIKit-Proxy header' }));
        return;
      }

      // Origin check
      if (!allowed) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Origin not allowed' }));
        return;
      }

      // Rate limiting
      const ip = req.socket.remoteAddress || 'unknown';
      if (!checkRateLimit(ip)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }));
        return;
      }

      proxyRequest(req, res, config);
      return;
    }
  }

  // Serve static files
  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`\n  NowAIKit Web Server`);
  console.log(`  ───────────────────────────────`);
  console.log(`  Local:   http://localhost:${PORT}`);
  if (HOST !== '127.0.0.1' && HOST !== 'localhost') {
    console.log(`  Network: http://${HOST}:${PORT}`);
  }
  console.log(`\n  AI proxy:  /api/ai/* -> provider APIs (rate-limited, CSRF-protected)`);
  console.log(`  Static:    ${STATIC_DIR}`);
  console.log(`\n  All AI providers supported (CORS proxied).`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
