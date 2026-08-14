/**
 * Service Portfolio modeling: business services & service offerings.
 * Read: Tier 0. Create: Tier 1 (WRITE_ENABLED=true).
 *
 * Tables:
 *   cmdb_ci_service   — business services
 *   service_offering  — service offerings (child of a business service)
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

export function getServicePortfolioToolDefinitions() {
  return [
    {
      name: 'create_business_service',
      description: 'Create a business service (cmdb_ci_service). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Business service name' },
          owned_by: { type: 'string', description: 'Owner user sys_id' },
          support_group: { type: 'string', description: 'Support group sys_id' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name'],
      },
    },
    {
      name: 'create_service_offering',
      description: 'Create a service offering under a business service (service_offering). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Service offering name' },
          parent: { type: 'string', description: 'Parent business service sys_id (cmdb_ci_service)' },
          support_group: { type: 'string', description: 'Support group sys_id' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name'],
      },
    },
    {
      name: 'list_service_offerings',
      description: 'List service offerings (service_offering), optionally by parent business service',
      inputSchema: {
        type: 'object',
        properties: {
          parent: { type: 'string', description: 'Parent business service sys_id' },
          query: { type: 'string', description: 'Search offerings by name' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
  ];
}

export async function executeServicePortfolioToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'create_business_service': {
      requireWrite();
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { name: args.name, ...(args.fields ?? {}) };
      if (args.owned_by) payload.owned_by = args.owned_by;
      if (args.support_group) payload.support_group = args.support_group;
      const result = await client.createRecord('cmdb_ci_service', payload);
      return { ...result, summary: `Created business service "${args.name}"` };
    }
    case 'create_service_offering': {
      requireWrite();
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { name: args.name, ...(args.fields ?? {}) };
      if (args.parent) payload.parent = args.parent;
      if (args.support_group) payload.support_group = args.support_group;
      const result = await client.createRecord('service_offering', payload);
      return { ...result, summary: `Created service offering "${args.name}"` };
    }
    case 'list_service_offerings': {
      const parts: string[] = [];
      if (args.parent) parts.push(`parent=${args.parent}`);
      if (args.query) parts.push(`nameCONTAINS${args.query}`);
      return await client.queryRecords({ table: 'service_offering', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    default:
      return null;
  }
}
