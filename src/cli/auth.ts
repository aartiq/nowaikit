/**
 * `nowaikit auth` subcommands — per-user OAuth / login management.
 *
 * login  — opens browser to ServiceNow OAuth consent, stores token
 * logout — removes stored token
 * whoami — show which ServiceNow user is currently authenticated
 */
import { input, password, select } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { createHash, randomBytes } from 'crypto';
import { listInstances } from './config-store.js';

const b64url = (b: Buffer): string => b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

interface UserToken {
  instanceUrl: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  snUser: string;
  snUserSysId: string;
}

interface TokenStore {
  tokens: Record<string, UserToken>;
}

function tokenPath(): string {
  const dir = join(homedir(), '.config', 'nowaikit');
  // mode is honored on POSIX (owner-only) and harmlessly ignored on Windows,
  // where the file is already scoped to the user profile.
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 });
  return join(dir, 'tokens.json');
}

function loadTokens(): TokenStore {
  const p = tokenPath();
  if (!existsSync(p)) return { tokens: {} };
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as TokenStore;
  } catch {
    return { tokens: {} };
  }
}

function saveTokens(store: TokenStore): void {
  const p = tokenPath();
  // tokens.json holds OAuth access + refresh tokens: keep it owner-only.
  // `mode` only applies when the file is created, so also chmod an existing file.
  // Both are POSIX-effective and safely ignored/no-op on Windows (user-profile scoped).
  writeFileSync(p, JSON.stringify(store, null, 2), { encoding: 'utf8', mode: 0o600 });
  try { chmodSync(p, 0o600); } catch { /* Windows / restricted FS: ignore */ }
}

function tokenKey(instanceUrl: string): string {
  return instanceUrl.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_');
}

export async function authLogin(): Promise<void> {
  const instances = listInstances();
  if (instances.length === 0) {
    console.log(chalk.yellow('No instances configured. Run `nowaikit setup` first.'));
    return;
  }

  const instanceUrl = instances.length === 1
    ? instances[0]!.instanceUrl
    : await select<string>({
        message: 'Choose instance to authenticate against:',
        choices: instances.map(i => ({ name: `${i.name} (${i.instanceUrl})`, value: i.instanceUrl })),
      });

  const instance = instances.find(i => i.instanceUrl === instanceUrl);
  if (!instance) return;

  console.log('');
  console.log(chalk.bold('Per-user OAuth login'));
  console.log(chalk.dim('Your queries will run in your own ServiceNow permission context.'));
  console.log('');

  if (instance.authMethod === 'oauth' && instance.clientId) {
    // OAuth Authorization Code flow — open browser.
    // PKCE is added ONLY for public clients (no client secret configured), so existing
    // confidential-client setups keep the exact same request they use today.
    const usePkce = !instance.clientSecret;
    const codeVerifier = usePkce ? b64url(randomBytes(32)) : '';
    const codeChallenge = usePkce ? b64url(createHash('sha256').update(codeVerifier).digest()) : '';

    const authUrl =
      `${instanceUrl}/oauth_auth.do` +
      `?response_type=code&client_id=${instance.clientId}` +
      `&redirect_uri=http://localhost:8765/callback` +
      (usePkce ? `&code_challenge=${codeChallenge}&code_challenge_method=S256` : '');

    console.log(chalk.cyan('Open this URL in your browser to authenticate:'));
    console.log(chalk.underline(authUrl));
    console.log('');

    const code = await input({
      message: 'Paste the authorization code from the redirect URL:',
    });

    const spinner = ora('Exchanging authorization code for token…').start();
    try {
      const tokenBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: instance.clientId,
        code,
        redirect_uri: 'http://localhost:8765/callback',
      });
      if (instance.clientSecret) tokenBody.set('client_secret', instance.clientSecret);
      if (usePkce) tokenBody.set('code_verifier', codeVerifier);
      const resp = await fetch(`${instanceUrl}/oauth_token.do`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenBody.toString(),
      });

      if (!resp.ok) {
        spinner.fail(chalk.red(`Token exchange failed: ${resp.status} ${resp.statusText}`));
        return;
      }

      const data = await resp.json() as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
      };

      // Identify the ServiceNow user this token belongs to via the current-user endpoint
      // (the old sys_idINSTANCEOF query matched nothing → always "unknown").
      const meResp = await fetch(`${instanceUrl}/api/now/ui/user/current_user`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: 'application/json',
        },
      });
      const meData = await meResp.json() as { result?: { user_name?: string; name?: string; user_sys_id?: string; sys_id?: string } };
      const snUser = meData.result?.user_name || meData.result?.name || 'unknown';
      const snUserSysId = meData.result?.user_sys_id || meData.result?.sys_id || '';

      const store = loadTokens();
      store.tokens[tokenKey(instanceUrl)] = {
        instanceUrl,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000 * 0.9,
        snUser,
        snUserSysId,
      };
      saveTokens(store);

      spinner.succeed(chalk.green(`Authenticated as ${snUser} on ${instanceUrl}`));
    } catch (err) {
      spinner.fail(chalk.red(`Error: ${err instanceof Error ? err.message : String(err)}`));
    }
  } else {
    // Basic auth per-user: prompt credentials, store them
    const username = await input({ message: 'Your ServiceNow username:' });
    const pass = await password({ message: 'Your ServiceNow password:', mask: '•' });

    const spinner = ora('Verifying credentials…').start();
    try {
      const creds = Buffer.from(`${username}:${pass}`).toString('base64');
      const resp = await fetch(
        `${instanceUrl}/api/now/table/sys_user?sysparm_query=user_name=${encodeURIComponent(username)}&sysparm_limit=1`,
        { headers: { Authorization: `Basic ${creds}`, Accept: 'application/json' } }
      );
      if (!resp.ok) {
        spinner.fail(chalk.red(`Auth failed: ${resp.status} ${resp.statusText}`));
        return;
      }
      const data = await resp.json() as { result?: Array<{ sys_id?: { value: string }; user_name?: { value: string } }> };
      const snUserSysId = data.result?.[0]?.sys_id?.value || '';

      const store = loadTokens();
      store.tokens[tokenKey(instanceUrl)] = {
        instanceUrl,
        accessToken: creds,
        refreshToken: '',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // basic auth doesn't expire
        snUser: username,
        snUserSysId,
      };
      saveTokens(store);

      spinner.succeed(chalk.green(`Saved credentials for ${username} on ${instanceUrl}`));
    } catch (err) {
      spinner.fail(chalk.red(`Error: ${err instanceof Error ? err.message : String(err)}`));
    }
  }
}

export function authLogout(instanceUrl?: string): void {
  const store = loadTokens();
  if (instanceUrl) {
    const key = tokenKey(instanceUrl);
    if (store.tokens[key]) {
      delete store.tokens[key];
      saveTokens(store);
      console.log(chalk.green(`Logged out from ${instanceUrl}`));
    } else {
      console.log(chalk.yellow(`No token found for ${instanceUrl}`));
    }
  } else {
    store.tokens = {};
    saveTokens(store);
    console.log(chalk.green('Logged out from all instances'));
  }
}

export function authWhoami(): void {
  const store = loadTokens();
  const tokens = Object.values(store.tokens);
  if (tokens.length === 0) {
    console.log(chalk.dim('Not authenticated. Run `nowaikit auth login`'));
    return;
  }
  for (const t of tokens) {
    const expired = Date.now() > t.expiresAt;
    const status = expired ? chalk.red('(expired)') : chalk.green('(active)');
    console.log(`  ${t.instanceUrl} → ${chalk.bold(t.snUser)} ${status}`);
  }
}

export function getStoredToken(instanceUrl: string): UserToken | undefined {
  const store = loadTokens();
  return store.tokens[tokenKey(instanceUrl)];
}

/**
 * Return a currently-valid stored token for an instance, refreshing it first if it is expired (or
 * within 60s of expiry) and a refresh token + OAuth client are available. Persists the rotated
 * token. Returns undefined if there is no stored token. Never throws (falls back to the stale token
 * so the caller can still try, and the client will refresh reactively on a 401).
 */
export async function getValidUserToken(instanceUrl: string): Promise<UserToken | undefined> {
  const store = loadTokens();
  const key = tokenKey(instanceUrl);
  const t = store.tokens[key];
  if (!t) return undefined;
  // Basic-auth stored creds (no refresh token) or a token that is still fresh: use as-is.
  if (!t.refreshToken || Date.now() < t.expiresAt - 60_000) return t;
  const inst = listInstances().find(i => i.instanceUrl === instanceUrl);
  if (!inst?.clientId) return t; // cannot refresh without the OAuth client id
  try {
    const body = new URLSearchParams({ grant_type: 'refresh_token', client_id: inst.clientId, refresh_token: t.refreshToken });
    if (inst.clientSecret) body.set('client_secret', inst.clientSecret);
    const resp = await fetch(`${instanceUrl}/oauth_token.do`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!resp.ok) return t;
    const data = await resp.json() as { access_token: string; refresh_token?: string; expires_in?: number };
    t.accessToken = data.access_token;
    if (data.refresh_token) t.refreshToken = data.refresh_token;
    t.expiresAt = Date.now() + (data.expires_in ? data.expires_in * 1000 * 0.9 : 25 * 60 * 1000);
    store.tokens[key] = t;
    saveTokens(store);
    return t;
  } catch {
    return t;
  }
}

/** Persist a refreshed per-user token (used as the client's onTokenRefreshed callback). */
export function persistRefreshedToken(instanceUrl: string, t: { accessToken: string; refreshToken: string; expiresAt: number }): void {
  const store = loadTokens();
  const key = tokenKey(instanceUrl);
  const existing = store.tokens[key];
  store.tokens[key] = {
    instanceUrl,
    accessToken: t.accessToken,
    refreshToken: t.refreshToken,
    expiresAt: t.expiresAt,
    snUser: existing?.snUser || 'unknown',
    snUserSysId: existing?.snUserSysId || '',
  };
  saveTokens(store);
}
