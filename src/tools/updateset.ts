/**
 * Update Set management tools — full lifecycle for ServiceNow Update Sets.
 *
 * Goes beyond the basic changeset tools in script.ts to provide:
 * - Create / switch / preview / complete / export
 * - Auto-creation guard (ensure active update set exists)
 * - Batch artifact registration
 *
 * Tier 0 (Read):  get_current_update_set, list_update_sets, preview_update_set
 * Tier 3 (Script): create_update_set, switch_update_set, complete_update_set,
 *                   export_update_set, retrieve_remote_update_set
 *
 * ServiceNow tables: sys_update_set, sys_update_xml, sys_remote_update_set, sys_user_preference
 *
 * A note on "current" vs "default" (see https://github.com/aartiq/nowaikit/issues/11):
 * `sys_update_set.is_default` marks the scope-wide fallback "Default" update set — a shared,
 * per-scope concept unrelated to any individual caller. The caller's own current update set,
 * the one ServiceNow's write-tracking path actually reads, lives in `sys_user_preference`
 * (name=sys_update_set, user=<caller>, value=<update set sys_id>). switch_update_set,
 * create_update_set's switch_to option, and ensure_active_update_set all previously wrote
 * is_default instead — which did not switch the caller's set, and could silently reassign the
 * scope's shared default as a side effect. All four tools below resolve and write the caller's
 * sys_user_preference instead, resolving the caller mode-agnostically via the encoded query
 * `javascript:gs.getUserID()` (already allowlisted by validateQuery for basic auth, OAuth
 * password grant, per-user delegated tokens, and impersonation alike).
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireScripting } from '../utils/permissions.js';

export function getUpdateSetToolDefinitions() {
  return [
    {
      name: 'get_current_update_set',
      description: 'Get the caller\'s actual current Update Set, resolved from their sys_user_preference (name=sys_update_set) — not an arbitrary in-progress set.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'list_update_sets',
      description: 'List Update Sets by state (in progress, complete, ignore)',
      inputSchema: {
        type: 'object',
        properties: {
          state: { type: 'string', description: 'State filter: "in progress", "complete", "ignore"' },
          query: { type: 'string', description: 'Additional encoded query filter' },
          limit: { type: 'number', description: 'Max records (default 25)' },
        },
        required: [],
      },
    },
    {
      name: 'create_update_set',
      description: 'Create a new Update Set and optionally make it the caller\'s current Update Set. **[Scripting]**',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Update Set name' },
          description: { type: 'string', description: 'Purpose or description' },
          release: { type: 'string', description: 'Target release label' },
          switch_to: { type: 'boolean', description: 'Make this the caller\'s current Update Set after creation (default true)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'switch_update_set',
      description: 'Make the specified Update Set the caller\'s current Update Set (writes their sys_user_preference, not is_default). **[Scripting]**',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'sys_id of the target Update Set' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'complete_update_set',
      description: 'Mark an Update Set as complete (ready for migration). **[Scripting]**',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'Update Set sys_id' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'preview_update_set',
      description: 'Preview all changes contained in an Update Set',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'Update Set sys_id' },
          limit: { type: 'number', description: 'Max records to list (default 100)' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'export_update_set',
      description: 'Get the XML export payload for an Update Set (as used in migration). **[Scripting]**',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'Update Set sys_id' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'ensure_active_update_set',
      description: 'Ensure the caller has an active Update Set selected; create one automatically if their current Update Set preference is missing or not in progress. **[Scripting]**',
      inputSchema: {
        type: 'object',
        properties: {
          default_name: { type: 'string', description: 'Name to use when auto-creating (default: "AI Session Update Set")' },
        },
        required: [],
      },
    },
  ];
}

// ─── Caller resolution and update-set preference helpers ──────────────────────
//
// See the module doc-comment above and https://github.com/aartiq/nowaikit/issues/11
// for why these exist instead of writing sys_update_set.is_default.

/**
 * Resolve the sys_id of the currently authenticated caller. Works across every
 * auth mode this connector supports (basic auth, OAuth password grant, per-user
 * delegated bearer tokens, impersonation) because gs.getUserID() is resolved by
 * the ServiceNow instance itself against whichever identity actually authenticated
 * the request — the client never needs to know a username ahead of time.
 */
async function getCallerSysId(client: ServiceNowClient): Promise<string> {
  const resp = await client.queryRecords({
    table: 'sys_user',
    query: 'sys_id=javascript:gs.getUserID()',
    limit: 1,
    fields: 'sys_id',
  });
  const sysId = resp.records?.[0]?.sys_id;
  if (!sysId) {
    throw new ServiceNowError(
      'Unable to resolve the current authenticated user (gs.getUserID() returned no match).',
      'QUERY_FAILED'
    );
  }
  return String(sysId);
}

/**
 * Look up the caller's sys_user_preference row for name=sys_update_set. Returns
 * the preference record's own sys_id (for PATCHing) and the Update Set sys_id it
 * currently points at (undefined if the caller has none selected).
 */
async function getCallerUpdateSetPreference(
  client: ServiceNowClient,
  callerSysId: string
): Promise<{ prefSysId?: string; updateSetSysId?: string }> {
  const resp = await client.queryRecords({
    table: 'sys_user_preference',
    query: `name=sys_update_set^user=${callerSysId}`,
    limit: 1,
    fields: 'sys_id,value',
  });
  const row = resp.records?.[0];
  const updateSetSysId = row?.value ? String(row.value) : undefined;
  return { prefSysId: row?.sys_id ? String(row.sys_id) : undefined, updateSetSysId };
}

/**
 * Make `updateSetSysId` the caller's current Update Set by writing their
 * sys_user_preference row directly — PATCH if one already exists, POST a new
 * one if not. This is the field ServiceNow's write-tracking path actually
 * reads; it deliberately never touches sys_update_set.is_default.
 */
async function setCallerUpdateSetPreference(
  client: ServiceNowClient,
  updateSetSysId: string
): Promise<Record<string, any>> {
  const callerSysId = await getCallerSysId(client);
  const { prefSysId } = await getCallerUpdateSetPreference(client, callerSysId);
  if (prefSysId) {
    return client.updateRecord('sys_user_preference', prefSysId, { value: updateSetSysId });
  }
  return client.createRecord('sys_user_preference', {
    name: 'sys_update_set',
    user: callerSysId,
    value: updateSetSysId,
  });
}

export async function executeUpdateSetToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>
): Promise<any> {
  switch (name) {
    case 'get_current_update_set': {
      const callerSysId = await getCallerSysId(client);
      const { updateSetSysId } = await getCallerUpdateSetPreference(client, callerSysId);
      if (!updateSetSysId) {
        return {
          count: 0,
          active_update_sets: [],
          note: 'Caller has no sys_user_preference (name=sys_update_set) set — no current Update Set selected.',
        };
      }
      const updateSet = await client.getRecord('sys_update_set', updateSetSysId);
      return { count: 1, active_update_sets: [updateSet] };
    }

    case 'list_update_sets': {
      let query = '';
      if (args.state) query = `state=${args.state}`;
      if (args.query) query = query ? `${query}^${args.query}` : args.query;
      const resp = await client.queryRecords({
        table: 'sys_update_set',
        query: query || undefined,
        limit: args.limit || 25,
        fields: 'sys_id,name,state,description,release,sys_updated_on,sys_updated_by',
      });
      return { count: resp.count, update_sets: resp.records };
    }

    case 'create_update_set': {
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      requireScripting();
      const payload: Record<string, any> = { name: args.name, state: 'in progress' };
      if (args.description) payload.description = args.description;
      if (args.release) payload.release = args.release;
      const result = await client.createRecord('sys_update_set', payload);
      const newId = String((result as any).sys_id || (result as any).result?.sys_id || '');
      if (newId && args.switch_to !== false) {
        await setCallerUpdateSetPreference(client, newId);
        return { action: 'created_and_switched', name: args.name, sys_id: newId, ...result };
      }
      return { action: 'created', name: args.name, sys_id: newId, ...result };
    }

    case 'switch_update_set': {
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      requireScripting();
      await setCallerUpdateSetPreference(client, args.sys_id);
      return { action: 'switched', sys_id: args.sys_id };
    }

    case 'complete_update_set': {
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      requireScripting();
      const result = await client.updateRecord('sys_update_set', args.sys_id, { state: 'complete' });
      return { action: 'completed', sys_id: args.sys_id, ...result };
    }

    case 'preview_update_set': {
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      // List all update XML records for this update set
      const resp = await client.queryRecords({
        table: 'sys_update_xml',
        query: `update_set=${args.sys_id}`,
        limit: args.limit || 100,
        fields: 'sys_id,name,type,action,payload,sys_updated_on',
      });
      const updateSet = await client.getRecord('sys_update_set', args.sys_id);
      return {
        update_set: updateSet,
        change_count: resp.count,
        changes: resp.records.map((r: any) => ({
          sys_id: r.sys_id,
          name: r.name,
          type: r.type,
          action: r.action,
          updated: r.sys_updated_on,
        })),
      };
    }

    case 'export_update_set': {
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      requireScripting();
      const updateSet = await client.getRecord('sys_update_set', args.sys_id);
      const xmlRecords = await client.queryRecords({
        table: 'sys_update_xml',
        query: `update_set=${args.sys_id}`,
        limit: 500,
        fields: 'sys_id,name,type,action,payload',
      });
      return {
        update_set_name: (updateSet as any).name,
        sys_id: args.sys_id,
        change_count: xmlRecords.count,
        note: 'Use the ServiceNow Update Set XML Export UI (/sys_update_set.do) to download the actual XML file for import into another instance.',
        changes_summary: xmlRecords.records.map((r: any) => ({ name: r.name, type: r.type, action: r.action })),
      };
    }

    case 'ensure_active_update_set': {
      requireScripting();
      const callerSysId = await getCallerSysId(client);
      const { updateSetSysId } = await getCallerUpdateSetPreference(client, callerSysId);
      if (updateSetSysId) {
        const updateSet = await client.getRecord('sys_update_set', updateSetSysId);
        if ((updateSet as any)?.state === 'in progress') {
          return { action: 'existing_found', update_set: updateSet };
        }
      }
      const defaultName = args.default_name || `AI Session Update Set ${new Date().toISOString().slice(0, 10)}`;
      const created = await client.createRecord('sys_update_set', { name: defaultName, state: 'in progress' });
      const createdId = String((created as any).sys_id || (created as any).result?.sys_id || '');
      if (createdId) {
        await setCallerUpdateSetPreference(client, createdId);
      }
      return { action: 'auto_created', name: defaultName, update_set: created };
    }

    default:
      return null;
  }
}
