import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  runWithDelegatedAuth,
  getDelegatedAuth,
  parseDelegatedAuthHeaders,
  isDelegatedAuthEnabled,
} from '../../src/utils/request-context.js';
import {
  isWriteEnabled,
  isScriptingEnabled,
  isCmdbWriteEnabled,
  requireWrite,
  requireScripting,
} from '../../src/utils/permissions.js';

describe('delegated-auth request context', () => {
  const savedEnv = { ...process.env };
  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('isDelegatedAuthEnabled reflects DELEGATED_AUTH env', () => {
    delete process.env.DELEGATED_AUTH;
    expect(isDelegatedAuthEnabled()).toBe(false);
    process.env.DELEGATED_AUTH = 'true';
    expect(isDelegatedAuthEnabled()).toBe(true);
  });

  it('getDelegatedAuth is undefined outside a context', () => {
    expect(getDelegatedAuth()).toBeUndefined();
  });

  it('binds context for its async lifetime', async () => {
    await runWithDelegatedAuth({ user: 'alice', bearerToken: 'tok' }, async () => {
      await Promise.resolve();
      expect(getDelegatedAuth()?.user).toBe('alice');
      expect(getDelegatedAuth()?.bearerToken).toBe('tok');
    });
    expect(getDelegatedAuth()).toBeUndefined();
  });

  it('parses delegated headers (lowercased)', () => {
    const ctx = parseDelegatedAuthHeaders({
      'x-servicenow-token': 'abc',
      'x-servicenow-instance-url': 'https://x.service-now.com',
      'x-nowaikit-write-enabled': 'true',
      'x-nowaikit-scripting-enabled': 'false',
      'x-nowaikit-tool-package': 'platform_developer',
      'x-nowaikit-user': 'bob@contoso.com',
    });
    expect(ctx.bearerToken).toBe('abc');
    expect(ctx.instanceUrl).toBe('https://x.service-now.com');
    expect(ctx.flags?.write).toBe(true);
    expect(ctx.flags?.scripting).toBe(false);
    expect(ctx.toolPackage).toBe('platform_developer');
    expect(ctx.user).toBe('bob@contoso.com');
  });
});

describe('permissions honour the delegated context over env', () => {
  const savedEnv = { ...process.env };
  beforeEach(() => {
    // Env says writes ON — delegated context must be able to override it OFF.
    process.env.WRITE_ENABLED = 'true';
    process.env.SCRIPTING_ENABLED = 'true';
    process.env.CMDB_WRITE_ENABLED = 'true';
  });
  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('falls back to env when no context is present', () => {
    expect(isWriteEnabled()).toBe(true);
    expect(isScriptingEnabled()).toBe(true);
  });

  it('a read-only delegated context overrides permissive env', async () => {
    await runWithDelegatedAuth({ flags: { write: false } }, async () => {
      expect(isWriteEnabled()).toBe(false);
      expect(isScriptingEnabled()).toBe(false);
      expect(isCmdbWriteEnabled()).toBe(false);
      expect(() => requireWrite()).toThrow(/disabled/);
    });
  });

  it('grants exactly the tiers the context allows', async () => {
    await runWithDelegatedAuth({ flags: { write: true, scripting: true } }, async () => {
      expect(isWriteEnabled()).toBe(true);
      expect(isScriptingEnabled()).toBe(true);
      expect(isCmdbWriteEnabled()).toBe(false); // not granted
      expect(() => requireWrite()).not.toThrow();
      expect(() => requireScripting()).not.toThrow();
    });
  });

  it('write requires the write flag even if scripting is set', async () => {
    await runWithDelegatedAuth({ flags: { write: false, scripting: true } }, async () => {
      expect(isScriptingEnabled()).toBe(false); // scripting needs write too
    });
  });
});
