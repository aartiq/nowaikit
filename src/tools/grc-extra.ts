/**
 * GRC / IRM authoring depth (controls, issues, control tests).
 * Read: Tier 0. Create/run: Tier 1 (WRITE_ENABLED=true).
 *
 * Tables (may vary by IRM version):
 *   sn_compliance_control       — compliance controls
 *   sn_compliance_control_test  — control tests/attestations
 *   sn_grc_issue                — GRC issues/findings
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

export function getGrcExtraToolDefinitions() {
  return [
    {
      name: 'list_grc_issues',
      description: 'List GRC issues/findings (sn_grc_issue), optionally by state or owner',
      inputSchema: {
        type: 'object',
        properties: {
          state: { type: 'string', description: 'Issue state filter' },
          owner: { type: 'string', description: 'Owner/assigned user sys_id' },
          query: { type: 'string', description: 'Search issues by short description' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
    {
      name: 'create_grc_issue',
      description: 'Raise a GRC issue/finding (sn_grc_issue). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          short_description: { type: 'string', description: 'Issue summary' },
          description: { type: 'string', description: 'Full description' },
          source: { type: 'string', description: 'Source record sys_id (control/risk/audit)' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['short_description'],
      },
    },
    {
      name: 'create_grc_control',
      description: 'Author a compliance control (sn_compliance_control). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Control name' },
          description: { type: 'string', description: 'Control description' },
          profile: { type: 'string', description: 'Related profile/entity sys_id' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name'],
      },
    },
    {
      name: 'run_control_test',
      description: 'Create/attest a control test (sn_compliance_control_test). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          control: { type: 'string', description: 'sys_id of the control (sn_compliance_control)' },
          result: { type: 'string', description: 'Test result/state (e.g. "pass", "fail")' },
          notes: { type: 'string', description: 'Test notes/evidence' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['control'],
      },
    },
  ];
}

export async function executeGrcExtraToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'list_grc_issues': {
      const parts: string[] = [];
      if (args.state) parts.push(`state=${args.state}`);
      if (args.owner) parts.push(`assigned_to=${args.owner}`);
      if (args.query) parts.push(`short_descriptionCONTAINS${args.query}`);
      return await client.queryRecords({ table: 'sn_grc_issue', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    case 'create_grc_issue': {
      requireWrite();
      if (!args.short_description) throw new ServiceNowError('short_description is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { short_description: args.short_description, ...(args.fields ?? {}) };
      if (args.description) payload.description = args.description;
      if (args.source) payload.source = args.source;
      const result = await client.createRecord('sn_grc_issue', payload);
      return { ...result, summary: `Created GRC issue "${args.short_description}"` };
    }
    case 'create_grc_control': {
      requireWrite();
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { name: args.name, ...(args.fields ?? {}) };
      if (args.description) payload.description = args.description;
      if (args.profile) payload.profile = args.profile;
      const result = await client.createRecord('sn_compliance_control', payload);
      return { ...result, summary: `Created control "${args.name}"` };
    }
    case 'run_control_test': {
      requireWrite();
      if (!args.control) throw new ServiceNowError('control is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { control: args.control, ...(args.fields ?? {}) };
      if (args.result) payload.state = args.result;
      if (args.notes) payload.notes = args.notes;
      const result = await client.createRecord('sn_compliance_control_test', payload);
      return { ...result, summary: `Recorded control test for ${args.control}` };
    }
    default:
      return null;
  }
}
