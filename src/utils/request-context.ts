/**
 * Per-request delegated-auth context (DELEGATED_AUTH mode).
 *
 * When NowAIKit runs behind the NowAIKit Gateway (or any trusted upstream that
 * performs per-user identity), each inbound HTTP request can carry the user's
 * ServiceNow token and a resolved permission policy. This module threads that
 * per-request context to the ServiceNow client and the permission checks via
 * AsyncLocalStorage — without changing any tool signatures.
 *
 * Fully opt-in: only active when DELEGATED_AUTH=true AND a context is present.
 * In stdio / normal single-user mode there is no context, so behaviour is
 * identical to before (env-var driven).
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { timingSafeEqual } from 'node:crypto';

export interface DelegatedFlags {
  write?: boolean;
  cmdbWrite?: boolean;
  scripting?: boolean;
  nowAssist?: boolean;
  atf?: boolean;
}

export interface DelegatedAuth {
  /** The user's ServiceNow access token (OBO-exchanged upstream). */
  bearerToken?: string;
  /** Instance URL the upstream resolved for this user (multi-instance routing). */
  instanceUrl?: string;
  /** Per-user capability policy resolved by the upstream gateway. */
  flags?: DelegatedFlags;
  /** Resolved tool package / persona (informational). */
  toolPackage?: string;
  /** User identifier (for audit/logging only). */
  user?: string;
}

const store = new AsyncLocalStorage<DelegatedAuth>();

/** True when delegated-auth mode is switched on (`DELEGATED_AUTH=true` or `=strict`). */
export function isDelegatedAuthEnabled(): boolean {
  return process.env.DELEGATED_AUTH === 'true' || process.env.DELEGATED_AUTH === 'strict';
}

/**
 * Strict delegation: every tool call MUST carry a valid delegated token (which is only present when
 * the gateway secret matched), the request is rejected before any tool runs otherwise, and the server
 * never falls back to base credentials. Enabled with `DELEGATED_AUTH=strict` or
 * `NOWAIKIT_REQUIRE_DELEGATION=true`. This is the supported mode for backend-managed per-user OAuth.
 */
export function isDelegationRequired(): boolean {
  return process.env.DELEGATED_AUTH === 'strict' || process.env.NOWAIKIT_REQUIRE_DELEGATION === 'true';
}

/**
 * Tools that resolve a client directly from the instance manager (server-configured instances) rather
 * than the per-request delegated identity, so they bypass delegation and are refused under strict mode.
 */
export const DELEGATION_INSTANCE_SCOPED_TOOLS = new Set([
  'compare_instances', 'switch_instance', 'get_current_instance', 'list_instances',
]);

/**
 * Decide whether strict delegated-auth blocks this tool call. Returns an error code to reject with, or
 * null to allow. Reads the current async delegated context, so it must be called inside the request's
 * runWithDelegatedAuth scope. No-op (null) unless strict mode is on.
 */
export function strictDelegationViolation(toolName: string): 'DELEGATION_REQUIRED' | 'DELEGATION_INCOMPATIBLE_TOOL' | null {
  if (!isDelegationRequired()) return null;
  const ctx = getDelegatedAuth();
  if (!ctx?.bearerToken) return 'DELEGATION_REQUIRED';
  if (DELEGATION_INSTANCE_SCOPED_TOOLS.has(toolName)) return 'DELEGATION_INCOMPATIBLE_TOOL';
  return null;
}

/** Run `fn` with the given delegated-auth context bound for its async lifetime. */
export function runWithDelegatedAuth<T>(ctx: DelegatedAuth, fn: () => T): T {
  return store.run(ctx, fn);
}

/** The current request's delegated-auth context, or undefined outside one. */
export function getDelegatedAuth(): DelegatedAuth | undefined {
  return store.getStore();
}

/**
 * When NOWAIKIT_DELEGATED_SECRET is set, delegated-auth headers are only trusted if the
 * request carries a matching x-nowaikit-gateway-secret (constant-time compared). This
 * proves the request came from the trusted gateway and not from a client forging its own
 * permission flags. If the secret is unset, behaviour is unchanged (back-compat), and the
 * permission tiers still cap every delegated flag to the server's env ceiling.
 */
function gatewaySecretOk(get: (k: string) => string | undefined): boolean {
  const expected = process.env.NOWAIKIT_DELEGATED_SECRET;
  if (!expected) return true;
  const got = get('x-nowaikit-gateway-secret') || '';
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Build a delegated-auth context from inbound (lowercased) HTTP headers. */
export function parseDelegatedAuthHeaders(
  headers: Record<string, string | string[] | undefined>
): DelegatedAuth {
  const h = (k: string): string | undefined => {
    const v = headers[k];
    return Array.isArray(v) ? v[0] : v;
  };
  // Fail closed: a request without the gateway secret gets no token and no flags, so it
  // can neither reach ServiceNow as a delegated user nor self-assert a capability tier.
  if (!gatewaySecretOk(h)) {
    return { flags: {} };
  }
  const bool = (k: string): boolean => h(k) === 'true';
  return {
    bearerToken: h('x-servicenow-token'),
    instanceUrl: h('x-servicenow-instance-url'),
    toolPackage: h('x-nowaikit-tool-package'),
    user: h('x-nowaikit-user'),
    flags: {
      write: bool('x-nowaikit-write-enabled'),
      cmdbWrite: bool('x-nowaikit-cmdb-write-enabled'),
      scripting: bool('x-nowaikit-scripting-enabled'),
      atf: bool('x-nowaikit-atf-enabled'),
      nowAssist: bool('x-nowaikit-now-assist-enabled'),
    },
  };
}
