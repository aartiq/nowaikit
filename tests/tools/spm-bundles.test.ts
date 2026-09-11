import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSpmToolDefinitions, executeSpmToolCall } from '../../src/tools/spm.js';
import { getBundleToolDefinitions, executeBundleToolCall } from '../../src/tools/bundles.js';
import type { ServiceNowClient } from '../../src/servicenow/client.js';

const mockClient = {
  queryRecords: vi.fn(),
  getRecord: vi.fn(),
  createRecord: vi.fn(),
} as unknown as ServiceNowClient;

const qr = () => mockClient.queryRecords as ReturnType<typeof vi.fn>;
const gr = () => mockClient.getRecord as ReturnType<typeof vi.fn>;
const cr = () => mockClient.createRecord as ReturnType<typeof vi.fn>;

describe('SPM tool definitions', () => {
  it('exposes the SPM layer as first-class tools', () => {
    const names = getSpmToolDefinitions().map(t => t.name);
    expect(names).toEqual(expect.arrayContaining(['list_portfolios', 'get_portfolio', 'list_programs', 'list_demands', 'create_demand', 'list_goals', 'list_project_tasks']));
    getSpmToolDefinitions().forEach(t => { expect(t.name).toBeTruthy(); expect(t.description).toBeTruthy(); expect(t.inputSchema).toBeTruthy(); });
  });
});

describe('SPM tool calls hit the verified tables', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { delete process.env.WRITE_ENABLED; });

  it('list_portfolios queries pm_portfolio', async () => {
    qr().mockResolvedValue({ count: 2, records: [{ sys_id: 'p1' }, { sys_id: 'p2' }] });
    const res = await executeSpmToolCall(mockClient, 'list_portfolios', {});
    expect(qr()).toHaveBeenCalledWith(expect.objectContaining({ table: 'pm_portfolio' }));
    expect(res.count).toBe(2);
    expect(res.portfolios).toHaveLength(2);
  });

  it('list_demands queries dmn_demand', async () => {
    qr().mockResolvedValue({ count: 1, records: [{ sys_id: 'd1' }] });
    await executeSpmToolCall(mockClient, 'list_demands', {});
    expect(qr()).toHaveBeenCalledWith(expect.objectContaining({ table: 'dmn_demand' }));
  });

  it('list_project_tasks scopes to the parent project', async () => {
    qr().mockResolvedValue({ count: 0, records: [] });
    await executeSpmToolCall(mockClient, 'list_project_tasks', { project_sys_id: 'PRJ1' });
    expect(qr()).toHaveBeenCalledWith(expect.objectContaining({ table: 'pm_project_task', query: expect.stringContaining('project=PRJ1') }));
  });

  it('create_demand needs write and creates on dmn_demand', async () => {
    await expect(executeSpmToolCall(mockClient, 'create_demand', { short_description: 'x' })).rejects.toThrow();
    process.env.WRITE_ENABLED = 'true';
    cr().mockResolvedValue({ sys_id: 'newDemand' });
    const res = await executeSpmToolCall(mockClient, 'create_demand', { short_description: 'New capacity' });
    expect(cr()).toHaveBeenCalledWith('dmn_demand', expect.objectContaining({ short_description: 'New capacity' }));
    expect(res.action).toBe('created');
  });
});

describe('investigate_incident bundles context in one call', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns incident + similar + affected CI + related knowledge', async () => {
    // incident lookup by number
    qr()
      .mockResolvedValueOnce({ count: 1, records: [{ sys_id: { value: 'INC_SID' }, number: { value: 'INC0001' }, category: { value: 'software' }, cmdb_ci: { value: 'CI1' }, short_description: { value: 'email server down' } }] })
      .mockResolvedValueOnce({ count: 3, records: [{ number: 'INC0002' }, { number: 'INC0003' }, { number: 'INC0004' }] }) // similar
      .mockResolvedValueOnce({ count: 2, records: [{ type: 'depends on' }, { type: 'runs on' }] })                      // cmdb_rel_ci
      .mockResolvedValueOnce({ count: 1, records: [{ number: 'KB0001' }] });                                            // kb_knowledge
    gr().mockResolvedValue({ sys_id: 'CI1', name: 'EMAIL-PROD' }); // cmdb_ci

    const res = await executeBundleToolCall(mockClient, 'investigate_incident', { number_or_sysid: 'INC0001' });
    expect(res.incident).toBeTruthy();
    expect(res.similar_incidents).toHaveLength(3);
    expect(res.affected_ci.ci.name).toBe('EMAIL-PROD');
    expect(res.affected_ci.relationship_count).toBe(2);
    expect(res.related_knowledge).toHaveLength(1);
    expect(res.summary).toContain('one call');
    // the second incident query is the "similar" one, scoped by category and excluding self
    expect(qr().mock.calls[1][0].query).toContain('category=software');
    expect(qr().mock.calls[1][0].query).toContain('sys_id!=INC_SID');
  });

  it('degrades gracefully when there is no CI and sub-lookups fail', async () => {
    // short_description 'x' has no word longer than 3 chars, so the KB lookup is skipped (not queried).
    qr()
      .mockResolvedValueOnce({ count: 1, records: [{ sys_id: { value: 'S' }, number: { value: 'INC9' }, category: { value: '' }, cmdb_ci: { value: '' }, short_description: { value: 'x' } }] })
      .mockRejectedValueOnce(new Error('acl'));  // similar fails
    const res = await executeBundleToolCall(mockClient, 'investigate_incident', { number_or_sysid: 'INC9' });
    expect(res.similar_incidents).toEqual([]);
    expect(res.affected_ci).toBeNull();
    expect(res.related_knowledge).toEqual([]);
  });

  it('throws NOT_FOUND when the incident does not exist', async () => {
    qr().mockResolvedValueOnce({ count: 0, records: [] });
    await expect(executeBundleToolCall(mockClient, 'investigate_incident', { number_or_sysid: 'INC0000' })).rejects.toThrow(/not found/i);
  });
});

describe('bundle tool definitions', () => {
  it('defines investigate_incident', () => {
    expect(getBundleToolDefinitions().map(t => t.name)).toContain('investigate_incident');
  });
});
