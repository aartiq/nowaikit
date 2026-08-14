/**
 * SLA / OLA management tools. Read tools: Tier 0. Create/update: Tier 1 (WRITE_ENABLED=true).
 *
 * Tables:
 *   contract_sla — SLA/OLA definitions
 *   task_sla     — live SLA instances attached to tasks (percent, breach, stage)
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

export function getSlaToolDefinitions() {
  return [
    {
      name: 'list_sla_definitions',
      description: 'List SLA/OLA definitions (contract_sla), optionally filtered by name, table, or active status',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search definitions by name' },
          table: { type: 'string', description: 'Filter to a collection/table (e.g. "incident")' },
          active: { type: 'boolean', description: 'Filter to active definitions only' },
          limit: { type: 'number', description: 'Max records to return (default 50)' },
        },
        required: [],
      },
    },
    {
      name: 'create_sla_definition',
      description: 'Create an SLA/OLA definition (contract_sla). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'SLA definition name' },
          collection: { type: 'string', description: 'Table the SLA applies to (e.g. "incident")' },
          duration_type: { type: 'string', description: 'Duration type (e.g. "User specified")' },
          duration: { type: 'string', description: 'Duration value (e.g. "1970-01-01 04:00:00" for 4h)' },
          start_condition: { type: 'string', description: 'Encoded start condition' },
          stop_condition: { type: 'string', description: 'Encoded stop condition' },
          schedule: { type: 'string', description: 'Schedule sys_id (business hours)' },
          type: { type: 'string', description: '"SLA" or "OLA" (default SLA)' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name', 'collection'],
      },
    },
    {
      name: 'update_sla_definition',
      description: 'Update an SLA/OLA definition (contract_sla). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'sys_id of the definition' },
          fields: { type: 'object', description: 'Field values to update' },
        },
        required: ['sys_id', 'fields'],
      },
    },
    {
      name: 'get_task_sla',
      description: 'Get live SLA instances (task_sla) for a task — percent complete, breach status, stage, planned end',
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'string', description: 'sys_id of the task (incident/change/etc.)' },
          task_number: { type: 'string', description: 'Task number (e.g. INC0010001) if sys_id not known' },
          active_only: { type: 'boolean', description: 'Only in-progress SLAs (default true)' },
        },
        required: [],
      },
    },
    {
      name: 'list_breached_slas',
      description: 'List SLA instances that have breached or are at risk within a window (task_sla)',
      inputSchema: {
        type: 'object',
        properties: {
          breached: { type: 'boolean', description: 'true = already breached; false = at-risk/in-progress (default true)' },
          min_percentage: { type: 'number', description: 'For at-risk: minimum business_percentage (e.g. 80)' },
          sla_table: { type: 'string', description: 'Filter to a task table (e.g. "incident") via task.sys_class_name' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
  ];
}

export async function executeSlaToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'list_sla_definitions': {
      const parts: string[] = [];
      if (args.active !== undefined) parts.push(`active=${args.active ? 'true' : 'false'}`);
      if (args.table) parts.push(`collection=${args.table}`);
      if (args.query) parts.push(`nameCONTAINS${args.query}`);
      return await client.queryRecords({ table: 'contract_sla', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    case 'create_sla_definition': {
      requireWrite();
      if (!args.name || !args.collection) throw new ServiceNowError('name and collection are required', 'INVALID_REQUEST');
      const payload: Record<string, any> = {
        name: args.name,
        collection: args.collection,
        type: args.type ?? 'SLA',
        active: 'true',
        ...(args.fields ?? {}),
      };
      for (const k of ['duration_type', 'duration', 'start_condition', 'stop_condition', 'schedule']) {
        if (args[k] !== undefined) payload[k] = args[k];
      }
      const result = await client.createRecord('contract_sla', payload);
      return { ...result, summary: `Created SLA definition "${args.name}" on ${args.collection}` };
    }
    case 'update_sla_definition': {
      requireWrite();
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      const result = await client.updateRecord('contract_sla', args.sys_id, args.fields ?? {});
      return { ...result, summary: `Updated SLA definition ${args.sys_id}` };
    }
    case 'get_task_sla': {
      let taskId = args.task;
      if (!taskId && args.task_number) {
        const resp = await client.queryRecords({ table: 'task', query: `number=${args.task_number}`, limit: 1 });
        if (resp.count === 0) throw new ServiceNowError(`Task not found: ${args.task_number}`, 'NOT_FOUND');
        taskId = (resp.records[0] as any).sys_id;
      }
      if (!taskId) throw new ServiceNowError('task or task_number is required', 'INVALID_REQUEST');
      const parts = [`task=${taskId}`];
      if (args.active_only !== false) parts.push('active=true');
      return await client.queryRecords({
        table: 'task_sla',
        query: parts.join('^'),
        fields: 'sla,stage,business_percentage,percentage,has_breached,planned_end_time,business_time_left,sla.name',
        limit: 100,
      });
    }
    case 'list_breached_slas': {
      const parts: string[] = ['active=true'];
      if (args.breached !== false) {
        parts.push('has_breached=true');
      } else if (args.min_percentage !== undefined) {
        parts.push(`business_percentage>=${args.min_percentage}^has_breached=false`);
      } else {
        parts.push('has_breached=false');
      }
      if (args.sla_table) parts.push(`task.sys_class_name=${args.sla_table}`);
      return await client.queryRecords({
        table: 'task_sla',
        query: parts.join('^') + '^ORDERBYDESCbusiness_percentage',
        fields: 'task,task.number,sla.name,stage,business_percentage,has_breached,planned_end_time',
        limit: args.limit ?? 50,
      });
    }
    default:
      return null;
  }
}
