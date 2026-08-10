import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeUpdateSetToolCall, getUpdateSetToolDefinitions } from '../../src/tools/updateset.js';
import type { ServiceNowClient } from '../../src/servicenow/client.js';

const CALLER_SYS_ID = 'caller00000000000000000000000001';
const UPDATE_SET_SYS_ID = 'updateset0000000000000000000002';
const PREF_SYS_ID = 'pref000000000000000000000000003';

const mockClient = {
  queryRecords: vi.fn(),
  getRecord: vi.fn(),
  createRecord: vi.fn(),
  updateRecord: vi.fn(),
} as unknown as ServiceNowClient;

/**
 * Wires queryRecords so the "resolve caller" lookup (table=sys_user) always
 * succeeds, and the preference lookup (table=sys_user_preference) returns
 * whatever the test wants.
 */
function mockPreferenceLookup(existing: { prefSysId?: string; updateSetSysId?: string } | null) {
  (mockClient.queryRecords as ReturnType<typeof vi.fn>).mockImplementation((params: { table: string }) => {
    if (params.table === 'sys_user') {
      return Promise.resolve({ count: 1, records: [{ sys_id: CALLER_SYS_ID }] });
    }
    if (params.table === 'sys_user_preference') {
      if (!existing) return Promise.resolve({ count: 0, records: [] });
      return Promise.resolve({
        count: 1,
        records: [{ sys_id: existing.prefSysId, value: existing.updateSetSysId }],
      });
    }
    return Promise.resolve({ count: 0, records: [] });
  });
}

describe('getUpdateSetToolDefinitions', () => {
  it('returns all 8 update set tools', () => {
    const tools = getUpdateSetToolDefinitions();
    expect(tools.length).toBe(8);
    expect(tools.map(t => t.name)).toEqual([
      'get_current_update_set',
      'list_update_sets',
      'create_update_set',
      'switch_update_set',
      'complete_update_set',
      'preview_update_set',
      'export_update_set',
      'ensure_active_update_set',
    ]);
  });
});

describe('executeUpdateSetToolCall – switch_update_set', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.WRITE_ENABLED = 'true';
    process.env.SCRIPTING_ENABLED = 'true';
  });

  it('throws when sys_id is missing', async () => {
    await expect(executeUpdateSetToolCall(mockClient, 'switch_update_set', {})).rejects.toThrow('sys_id is required');
  });

  it('creates a new sys_user_preference when the caller has none, and never touches is_default', async () => {
    mockPreferenceLookup(null);
    (mockClient.createRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: PREF_SYS_ID });

    const result = await executeUpdateSetToolCall(mockClient, 'switch_update_set', { sys_id: UPDATE_SET_SYS_ID });

    expect(result.action).toBe('switched');
    expect(mockClient.createRecord).toHaveBeenCalledWith('sys_user_preference', {
      name: 'sys_update_set',
      user: CALLER_SYS_ID,
      value: UPDATE_SET_SYS_ID,
    });
    expect(mockClient.updateRecord).not.toHaveBeenCalled();
  });

  it('updates the existing sys_user_preference when the caller already has one, and never touches is_default', async () => {
    mockPreferenceLookup({ prefSysId: PREF_SYS_ID, updateSetSysId: 'someOldSet0000000000000000000009' });
    (mockClient.updateRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: PREF_SYS_ID });

    const result = await executeUpdateSetToolCall(mockClient, 'switch_update_set', { sys_id: UPDATE_SET_SYS_ID });

    expect(result.action).toBe('switched');
    expect(mockClient.updateRecord).toHaveBeenCalledWith('sys_user_preference', PREF_SYS_ID, {
      value: UPDATE_SET_SYS_ID,
    });
    expect(mockClient.createRecord).not.toHaveBeenCalled();
    // Regression guard for https://github.com/aartiq/nowaikit/issues/11 —
    // sys_update_set.is_default must never be written by this tool.
    expect(mockClient.updateRecord).not.toHaveBeenCalledWith('sys_update_set', expect.anything(), expect.objectContaining({ is_default: true }));
  });
});

describe('executeUpdateSetToolCall – create_update_set', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.WRITE_ENABLED = 'true';
    process.env.SCRIPTING_ENABLED = 'true';
  });

  it('throws when name is missing', async () => {
    await expect(executeUpdateSetToolCall(mockClient, 'create_update_set', {})).rejects.toThrow('name is required');
  });

  it('sets the caller preference (not is_default) when switch_to defaults true', async () => {
    mockPreferenceLookup(null);
    (mockClient.createRecord as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === 'sys_update_set') return Promise.resolve({ sys_id: UPDATE_SET_SYS_ID });
      if (table === 'sys_user_preference') return Promise.resolve({ sys_id: PREF_SYS_ID });
      return Promise.resolve({});
    });

    const result = await executeUpdateSetToolCall(mockClient, 'create_update_set', { name: 'JW - test' });

    expect(result.action).toBe('created_and_switched');
    expect(mockClient.createRecord).toHaveBeenCalledWith('sys_user_preference', expect.objectContaining({
      name: 'sys_update_set',
      value: UPDATE_SET_SYS_ID,
    }));
    expect(mockClient.updateRecord).not.toHaveBeenCalled();
  });

  it('does not touch the preference when switch_to is false', async () => {
    (mockClient.createRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: UPDATE_SET_SYS_ID });

    const result = await executeUpdateSetToolCall(mockClient, 'create_update_set', { name: 'JW - test', switch_to: false });

    expect(result.action).toBe('created');
    expect(mockClient.createRecord).toHaveBeenCalledTimes(1); // only the update set itself
    expect(mockClient.queryRecords).not.toHaveBeenCalled();
  });
});

describe('executeUpdateSetToolCall – ensure_active_update_set', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.WRITE_ENABLED = 'true';
    process.env.SCRIPTING_ENABLED = 'true';
  });

  it('returns the caller\'s existing update set when it is in progress', async () => {
    mockPreferenceLookup({ prefSysId: PREF_SYS_ID, updateSetSysId: UPDATE_SET_SYS_ID });
    (mockClient.getRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: UPDATE_SET_SYS_ID, state: 'in progress' });

    const result = await executeUpdateSetToolCall(mockClient, 'ensure_active_update_set', {});

    expect(result.action).toBe('existing_found');
    expect(mockClient.createRecord).not.toHaveBeenCalled();
  });

  it('auto-creates and sets the preference when the caller\'s existing set is not in progress', async () => {
    mockPreferenceLookup({ prefSysId: PREF_SYS_ID, updateSetSysId: UPDATE_SET_SYS_ID });
    (mockClient.getRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: UPDATE_SET_SYS_ID, state: 'complete' });
    (mockClient.createRecord as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === 'sys_update_set') return Promise.resolve({ sys_id: 'newset00000000000000000000000004' });
      return Promise.resolve({ sys_id: PREF_SYS_ID });
    });

    const result = await executeUpdateSetToolCall(mockClient, 'ensure_active_update_set', {});

    expect(result.action).toBe('auto_created');
    expect(mockClient.createRecord).toHaveBeenCalledWith('sys_update_set', expect.objectContaining({ state: 'in progress' }));
    // The auto-create payload must not set is_default — regression guard for issue #11.
    expect(mockClient.createRecord).not.toHaveBeenCalledWith('sys_update_set', expect.objectContaining({ is_default: true }));
  });

  it('auto-creates and sets the preference when the caller has none at all', async () => {
    mockPreferenceLookup(null);
    (mockClient.createRecord as ReturnType<typeof vi.fn>).mockImplementation((table: string) => {
      if (table === 'sys_update_set') return Promise.resolve({ sys_id: 'newset00000000000000000000000005' });
      return Promise.resolve({ sys_id: PREF_SYS_ID });
    });

    const result = await executeUpdateSetToolCall(mockClient, 'ensure_active_update_set', {});

    expect(result.action).toBe('auto_created');
    expect(mockClient.getRecord).not.toHaveBeenCalled();
  });
});

describe('executeUpdateSetToolCall – get_current_update_set', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resolves the caller\'s preference and returns that specific update set', async () => {
    mockPreferenceLookup({ prefSysId: PREF_SYS_ID, updateSetSysId: UPDATE_SET_SYS_ID });
    (mockClient.getRecord as ReturnType<typeof vi.fn>).mockResolvedValue({ sys_id: UPDATE_SET_SYS_ID, name: 'JW - test' });

    const result = await executeUpdateSetToolCall(mockClient, 'get_current_update_set', {});

    expect(result.count).toBe(1);
    expect(result.active_update_sets[0].sys_id).toBe(UPDATE_SET_SYS_ID);
    expect(mockClient.getRecord).toHaveBeenCalledWith('sys_update_set', UPDATE_SET_SYS_ID);
  });

  it('returns an empty result when the caller has no current update set selected', async () => {
    mockPreferenceLookup(null);

    const result = await executeUpdateSetToolCall(mockClient, 'get_current_update_set', {});

    expect(result.count).toBe(0);
    expect(result.active_update_sets).toEqual([]);
    expect(mockClient.getRecord).not.toHaveBeenCalled();
  });
});
