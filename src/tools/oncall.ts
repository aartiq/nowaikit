/**
 * On-Call Scheduling tools. Read: Tier 0. Create/override: Tier 1 (WRITE_ENABLED=true).
 *
 * Tables:
 *   cmn_rota          — rotation (roster group)
 *   cmn_rota_roster   — rosters within a rotation
 *   cmn_rota_member   — roster members
 *   cmn_rota_override — coverage overrides
 *   sys_user_grmember — group membership (used to resolve "who is on call")
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

export function getOnCallToolDefinitions() {
  return [
    {
      name: 'get_on_call_now',
      description: 'Find who is on call for a group right now. Returns the current roster members for the group\'s rotations',
      inputSchema: {
        type: 'object',
        properties: {
          group: { type: 'string', description: 'Group name or sys_id' },
        },
        required: ['group'],
      },
    },
    {
      name: 'list_rotas',
      description: 'List on-call rotations (cmn_rota), optionally filtered by group or name',
      inputSchema: {
        type: 'object',
        properties: {
          group: { type: 'string', description: 'Filter by group sys_id' },
          query: { type: 'string', description: 'Search rotations by name' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
    {
      name: 'create_rota_schedule',
      description: 'Create an on-call rotation (cmn_rota) for a group. Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Rotation name' },
          group: { type: 'string', description: 'Group sys_id that owns the rotation' },
          time_zone: { type: 'string', description: 'Time zone (e.g. "US/Eastern")' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name', 'group'],
      },
    },
    {
      name: 'add_roster_member',
      description: 'Add a member to an on-call roster (cmn_rota_member). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          roster: { type: 'string', description: 'sys_id of the roster (cmn_rota_roster)' },
          member: { type: 'string', description: 'sys_id of the group member (sys_user_grmember) or user' },
          order: { type: 'number', description: 'Rotation order' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['roster', 'member'],
      },
    },
    {
      name: 'create_on_call_override',
      description: 'Create an on-call coverage override for a date range (cmn_rota_override). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          roster: { type: 'string', description: 'sys_id of the roster being overridden' },
          member: { type: 'string', description: 'sys_id of the covering user/member' },
          start: { type: 'string', description: 'Override start (YYYY-MM-DD HH:MM:SS)' },
          end: { type: 'string', description: 'Override end (YYYY-MM-DD HH:MM:SS)' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['roster', 'member', 'start', 'end'],
      },
    },
  ];
}

async function resolveGroup(client: ServiceNowClient, group: string): Promise<string> {
  if (/^[0-9a-f]{32}$/i.test(group)) return group;
  const resp = await client.queryRecords({ table: 'sys_user_group', query: `name=${group}`, limit: 1 });
  if (resp.count === 0) throw new ServiceNowError(`Group not found: ${group}`, 'NOT_FOUND');
  return (resp.records[0] as any).sys_id;
}

export async function executeOnCallToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'get_on_call_now': {
      const groupId = await resolveGroup(client, args.group);
      const rotas = await client.queryRecords({ table: 'cmn_rota', query: `group=${groupId}`, limit: 20 });
      const rotaIds = (rotas.records as any[]).map((r) => r.sys_id);
      if (rotaIds.length === 0) return { group: args.group, rotations: [], members: [], note: 'No rotations defined for this group.' };
      const rosters = await client.queryRecords({ table: 'cmn_rota_roster', query: `rotaIN${rotaIds.join(',')}`, limit: 50 });
      const rosterIds = (rosters.records as any[]).map((r) => r.sys_id);
      const members = rosterIds.length
        ? await client.queryRecords({
            table: 'cmn_rota_member',
            query: `rosterIN${rosterIds.join(',')}`,
            fields: 'member,member.name,roster,roster.name,order',
            limit: 100,
          })
        : { records: [], count: 0 };
      return {
        group: args.group,
        rotations: rotas.records,
        members: (members as any).records,
        note: 'Members are the on-call roster. For the precise current person, use the On-Call "Who is on call" REST API if installed.',
      };
    }
    case 'list_rotas': {
      const parts: string[] = [];
      if (args.group) parts.push(`group=${args.group}`);
      if (args.query) parts.push(`nameCONTAINS${args.query}`);
      return await client.queryRecords({ table: 'cmn_rota', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    case 'create_rota_schedule': {
      requireWrite();
      if (!args.name || !args.group) throw new ServiceNowError('name and group are required', 'INVALID_REQUEST');
      const group = await resolveGroup(client, args.group);
      const payload: Record<string, any> = { name: args.name, group, ...(args.fields ?? {}) };
      if (args.time_zone) payload.time_zone = args.time_zone;
      const result = await client.createRecord('cmn_rota', payload);
      return { ...result, summary: `Created rotation "${args.name}"` };
    }
    case 'add_roster_member': {
      requireWrite();
      if (!args.roster || !args.member) throw new ServiceNowError('roster and member are required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { roster: args.roster, member: args.member, ...(args.fields ?? {}) };
      if (args.order !== undefined) payload.order = args.order;
      const result = await client.createRecord('cmn_rota_member', payload);
      return { ...result, summary: `Added member to roster ${args.roster}` };
    }
    case 'create_on_call_override': {
      requireWrite();
      if (!args.roster || !args.member || !args.start || !args.end) {
        throw new ServiceNowError('roster, member, start and end are required', 'INVALID_REQUEST');
      }
      const payload: Record<string, any> = {
        roster: args.roster,
        member: args.member,
        start_date_time: args.start,
        end_date_time: args.end,
        ...(args.fields ?? {}),
      };
      const result = await client.createRecord('cmn_rota_override', payload);
      return { ...result, summary: `Created on-call override ${args.start} → ${args.end}` };
    }
    default:
      return null;
  }
}
