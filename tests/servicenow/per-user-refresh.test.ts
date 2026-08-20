import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ServiceNowClient } from '../../src/servicenow/client.js';

/**
 * Guards the per-user OAuth refresh lifecycle, and critically that the multi-tenant GATEWAY path
 * (injected token, no refresh token) is NEVER refreshed — that path is live for customers.
 */
function res(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    text: async () => JSON.stringify(body),
    json: async () => body,
  } as unknown as Response;
}

describe('per-user OAuth refresh gating', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => { fetchMock = vi.fn(); (global as any).fetch = fetchMock; });
  afterEach(() => { vi.restoreAllMocks(); });

  it('GATEWAY per-user (no refresh token) does NOT hit the token endpoint on 401', async () => {
    fetchMock.mockResolvedValue(res(401, { error: { message: 'User Not Authenticated' } }));
    const c = new ServiceNowClient({
      instanceUrl: 'https://gw.service-now.com',
      authMethod: 'oauth',
      authMode: 'per-user',
      perUserBearerToken: 'injected-by-copilot',
    });
    await expect(c.queryRecords({ table: 'incident', limit: 1 })).rejects.toBeTruthy();
    const hitToken = fetchMock.mock.calls.some((call) => String(call[0]).includes('/oauth_token.do'));
    expect(hitToken).toBe(false); // gateway token is not ours to refresh
  });

  it('LOCAL per-user (refresh token + client) refreshes on 401, retries, and persists', async () => {
    const persisted: any[] = [];
    let dataCall = 0;
    fetchMock.mockImplementation(async (url: string, opts: any) => {
      if (String(url).includes('/oauth_token.do')) {
        expect(String(opts.body)).toContain('grant_type=refresh_token');
        return res(200, { access_token: 'NEW_AT', refresh_token: 'NEW_RT', expires_in: 1800 });
      }
      dataCall++;
      return dataCall === 1 ? res(401, { error: { message: 'expired' } }) : res(200, { result: [{ number: 'INC1' }] });
    });
    const c = new ServiceNowClient({
      instanceUrl: 'https://local.service-now.com',
      authMethod: 'oauth',
      authMode: 'per-user',
      perUserBearerToken: 'OLD_AT',
      perUserRefreshToken: 'OLD_RT',
      perUserTokenExpiry: Date.now() + 3_600_000,
      oauth: { clientId: 'cid', clientSecret: 'sec' },
      onTokenRefreshed: (t) => persisted.push(t),
    });
    const out = await c.queryRecords({ table: 'incident', limit: 1 });
    expect(out).toBeTruthy();
    const hitToken = fetchMock.mock.calls.some((call) => String(call[0]).includes('/oauth_token.do'));
    expect(hitToken).toBe(true);
    expect(persisted).toHaveLength(1);
    expect(persisted[0].accessToken).toBe('NEW_AT');
    expect(persisted[0].refreshToken).toBe('NEW_RT');
  });
});
