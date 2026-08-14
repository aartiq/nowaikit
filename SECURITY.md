# Security Policy

## Data Handling

NowAIKit is designed with security as a priority:

### Authentication
- Supports OAuth 2.0 (preferred) and Basic authentication
- Credentials stored only in environment variables, never in code
- No credentials are logged or written to disk

### Access Control
- **Read-only by default**: All write operations disabled unless explicitly enabled
- **Table allowlist**: Only approved tables accessible unless ALLOW_ANY_TABLE=true
- **Script execution safeguards**: Requires both WRITE_ENABLED=true and SCRIPTING_ENABLED=true

### Production Recommendations
1. Never enable SCRIPTING_ENABLED=true in production unless absolutely necessary
2. Keep WRITE_ENABLED=false for read-only integrations
3. Use OAuth authentication over Basic auth
4. Regularly rotate credentials
5. Use service accounts with minimal required permissions

## Reporting Vulnerabilities

If you discover a security vulnerability, please open a GitHub issue or contact the maintainers.

## Dependency Security

Runtime dependencies are pinned to patched versions via npm `overrides` (fast-uri, ip-address,
body-parser, qs, hono, @hono/node-server), and audited on each release.

One advisory has no fixed upstream version at this time:

- **image-size** (transitive, via `pptxgenjs`, used only by the optional PDF/PPTX report export):
  a denial-of-service in the ICNS/JXL/HEIF parsers when decoding a malformed image. NowAIKit only
  **generates** reports and never parses untrusted image files through this library (pptxgenjs does
  not invoke it in NowAIKit's Node path), so the vulnerable code is not reachable in normal use. It
  is pinned to the latest release (2.0.2) and will be cleared when an upstream fix ships.

## Known Limitations

1. **Script execution risk**: When enabled, execute_script_include can run arbitrary server-side code
2. **Natural language processing**: Simplified NLP may misinterpret commands - always verify
