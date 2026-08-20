import { describe, it, expect, afterEach } from 'vitest';
import { ServiceNowClient } from '../../src/servicenow/client.js';

/**
 * Server-side script execution has no supported ServiceNow REST endpoint. Guards that we fail with a
 * clear, actionable error (not a silent/malformed call to a bogus endpoint) unless the optional helper
 * endpoint is configured.
 */
describe('executeScript transport', () => {
  const prev = process.env.SCRIPT_EXEC_ENDPOINT;
  afterEach(() => { if (prev === undefined) delete process.env.SCRIPT_EXEC_ENDPOINT; else process.env.SCRIPT_EXEC_ENDPOINT = prev; });

  it('throws SCRIPT_EXEC_UNAVAILABLE with guidance when no helper endpoint is set', async () => {
    delete process.env.SCRIPT_EXEC_ENDPOINT;
    const c = new ServiceNowClient({ instanceUrl: 'https://x.service-now.com', authMethod: 'basic', basic: { username: 'a', password: 'b' } });
    await expect(c.executeScript('gs.info(1)')).rejects.toMatchObject({ code: 'SCRIPT_EXEC_UNAVAILABLE' });
  });
});
