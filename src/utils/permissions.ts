import { ServiceNowError } from './errors.js';
import { getDelegatedAuth } from './request-context.js';

/**
 * Permission tier utilities for NowAIKit tools.
 *
 * Tier 0 – Always available (all read tools)
 * Tier 1 – WRITE_ENABLED=true (standard ITSM writes)
 * Tier 2 – WRITE_ENABLED=true + CMDB_WRITE_ENABLED=true (CI create/update)
 * Tier 3 – WRITE_ENABLED=true + SCRIPTING_ENABLED=true (scripts/changesets)
 * Tier AI – NOW_ASSIST_ENABLED=true (generative AI tools)
 * Tier ATF – ATF_ENABLED=true (test execution)
 *
 * Source of truth: process.env by default. When a request runs under a
 * delegated-auth context (DELEGATED_AUTH mode, e.g. behind NowAIKit Gateway),
 * the per-user policy on that context takes precedence — so capability is
 * governed per user/request, not per server.
 */

export function isWriteEnabled(): boolean {
  const d = getDelegatedAuth();
  if (d) return d.flags?.write === true;
  return process.env.WRITE_ENABLED === 'true';
}

export function isCmdbWriteEnabled(): boolean {
  const d = getDelegatedAuth();
  if (d) return d.flags?.write === true && d.flags?.cmdbWrite === true;
  return process.env.WRITE_ENABLED === 'true' && process.env.CMDB_WRITE_ENABLED === 'true';
}

export function isScriptingEnabled(): boolean {
  const d = getDelegatedAuth();
  if (d) return d.flags?.write === true && d.flags?.scripting === true;
  return process.env.WRITE_ENABLED === 'true' && process.env.SCRIPTING_ENABLED === 'true';
}

export function isNowAssistEnabled(): boolean {
  const d = getDelegatedAuth();
  if (d) return d.flags?.nowAssist === true;
  return process.env.NOW_ASSIST_ENABLED === 'true';
}

export function isAtfEnabled(): boolean {
  const d = getDelegatedAuth();
  if (d) return d.flags?.atf === true;
  return process.env.ATF_ENABLED === 'true';
}

export function requireWrite(): void {
  if (!isWriteEnabled()) {
    throw new ServiceNowError(
      'Write operations are disabled. Set WRITE_ENABLED=true to enable.',
      'WRITE_NOT_ENABLED'
    );
  }
}

export function requireCmdbWrite(): void {
  requireWrite();
  if (!isCmdbWriteEnabled()) {
    throw new ServiceNowError(
      'CMDB write operations are disabled. Set WRITE_ENABLED=true and CMDB_WRITE_ENABLED=true to enable.',
      'CMDB_WRITE_NOT_ENABLED'
    );
  }
}

export function requireScripting(): void {
  requireWrite();
  if (!isScriptingEnabled()) {
    throw new ServiceNowError(
      'Scripting operations are disabled. Set WRITE_ENABLED=true and SCRIPTING_ENABLED=true to enable.',
      'SCRIPTING_NOT_ENABLED'
    );
  }
}

export function requireNowAssist(): void {
  if (!isNowAssistEnabled()) {
    throw new ServiceNowError(
      'Now Assist / AI features are disabled. Set NOW_ASSIST_ENABLED=true to enable.',
      'NOW_ASSIST_NOT_ENABLED'
    );
  }
}

export function requireAtf(): void {
  if (!isAtfEnabled()) {
    throw new ServiceNowError(
      'ATF test execution is disabled. Set ATF_ENABLED=true to enable.',
      'ATF_NOT_ENABLED'
    );
  }
}

// Fluent/now-sdk availability is a local server concern, not a per-user policy —
// it always reads from the environment.
export function requireFluent(): void {
  if (process.env.FLUENT_ENABLED !== 'true') {
    throw new ServiceNowError(
      'Fluent/now-sdk operations are disabled. Set FLUENT_ENABLED=true to enable.',
      'FLUENT_NOT_ENABLED'
    );
  }
}

export function isFluentEnabled(): boolean {
  return process.env.FLUENT_ENABLED === 'true';
}
