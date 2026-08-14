/**
 * Catalog fulfillment + user criteria tools. Read: Tier 0. Create/update: Tier 1.
 *
 * Tables:
 *   sc_req_item                     — requested items (RITM)
 *   sc_task                         — catalog fulfillment tasks (SCTASK)
 *   sc_category                     — catalog categories
 *   user_criteria                   — audience/entitlement criteria
 *   sc_cat_item_user_criteria_mtom  — criteria ↔ catalog item link (available-for)
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

export function getCatalogFulfillmentToolDefinitions() {
  return [
    {
      name: 'get_request_item',
      description: 'Get a requested item (RITM) with its variables, by number or sys_id',
      inputSchema: {
        type: 'object',
        properties: {
          number: { type: 'string', description: 'RITM number (e.g. RITM0010001)' },
          sys_id: { type: 'string', description: 'sys_id of the sc_req_item' },
        },
        required: [],
      },
    },
    {
      name: 'update_request_item',
      description: 'Update the state/stage or fields of a requested item (sc_req_item). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'sys_id of the RITM' },
          state: { type: 'string', description: 'New state value' },
          stage: { type: 'string', description: 'New stage value' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'list_catalog_tasks',
      description: 'List catalog fulfillment tasks (SCTASK), optionally by request item, assignment group, or state',
      inputSchema: {
        type: 'object',
        properties: {
          request_item: { type: 'string', description: 'Parent RITM sys_id' },
          assignment_group: { type: 'string', description: 'Assignment group sys_id' },
          active: { type: 'boolean', description: 'Filter to active tasks only' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
    {
      name: 'complete_catalog_task',
      description: 'Close a catalog fulfillment task (sc_task) as complete. Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          sys_id: { type: 'string', description: 'sys_id of the SCTASK' },
          close_notes: { type: 'string', description: 'Closure notes' },
          state: { type: 'string', description: 'Closed state value (default 3 = Closed Complete)' },
        },
        required: ['sys_id'],
      },
    },
    {
      name: 'list_catalog_categories',
      description: 'List catalog categories (sc_category), optionally filtered by catalog or title',
      inputSchema: {
        type: 'object',
        properties: {
          catalog: { type: 'string', description: 'Catalog sys_id to filter by' },
          query: { type: 'string', description: 'Search categories by title' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
        required: [],
      },
    },
    {
      name: 'create_catalog_category',
      description: 'Create a catalog category (sc_category). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Category title' },
          catalog: { type: 'string', description: 'Catalog sys_id (sc_catalog)' },
          description: { type: 'string', description: 'Category description' },
          parent: { type: 'string', description: 'Parent category sys_id (for sub-categories)' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['title'],
      },
    },
    {
      name: 'create_user_criteria',
      description: 'Create a user criteria record (user_criteria) for catalog entitlement/audience. Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'User criteria name' },
          roles: { type: 'string', description: 'Comma-separated role sys_ids' },
          groups: { type: 'string', description: 'Comma-separated group sys_ids' },
          users: { type: 'string', description: 'Comma-separated user sys_ids' },
          match_all: { type: 'boolean', description: 'Require all conditions to match' },
          fields: { type: 'object', description: 'Additional field values' },
        },
        required: ['name'],
      },
    },
    {
      name: 'assign_user_criteria',
      description: 'Attach a user criteria to a catalog item as available-for (sc_cat_item_user_criteria_mtom). Requires WRITE_ENABLED=true',
      inputSchema: {
        type: 'object',
        properties: {
          catalog_item: { type: 'string', description: 'sys_id of the catalog item (sc_cat_item)' },
          user_criteria: { type: 'string', description: 'sys_id of the user_criteria record' },
        },
        required: ['catalog_item', 'user_criteria'],
      },
    },
  ];
}

export async function executeCatalogFulfillmentToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'get_request_item': {
      let ritm;
      if (args.sys_id) {
        ritm = await client.getRecord('sc_req_item', args.sys_id);
      } else if (args.number) {
        const resp = await client.queryRecords({ table: 'sc_req_item', query: `number=${args.number}`, limit: 1 });
        if (resp.count === 0) throw new ServiceNowError(`RITM not found: ${args.number}`, 'NOT_FOUND');
        ritm = resp.records[0];
      } else {
        throw new ServiceNowError('number or sys_id is required', 'INVALID_REQUEST');
      }
      const sysId = (ritm as any).sys_id;
      const vars = await client
        .queryRecords({ table: 'sc_item_option_mtom', query: `request_item=${sysId}`, fields: 'sc_item_option.item_option_new.question_text,sc_item_option.value', limit: 100 })
        .catch(() => ({ records: [] }));
      return { request_item: ritm, variables: (vars as any).records };
    }
    case 'update_request_item': {
      requireWrite();
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { ...(args.fields ?? {}) };
      if (args.state !== undefined) payload.state = args.state;
      if (args.stage !== undefined) payload.stage = args.stage;
      const result = await client.updateRecord('sc_req_item', args.sys_id, payload);
      return { ...result, summary: `Updated RITM ${args.sys_id}` };
    }
    case 'list_catalog_tasks': {
      const parts: string[] = [];
      if (args.request_item) parts.push(`request_item=${args.request_item}`);
      if (args.assignment_group) parts.push(`assignment_group=${args.assignment_group}`);
      if (args.active !== undefined) parts.push(`active=${args.active ? 'true' : 'false'}`);
      return await client.queryRecords({ table: 'sc_task', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    case 'complete_catalog_task': {
      requireWrite();
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { state: args.state ?? '3' };
      if (args.close_notes) payload.close_notes = args.close_notes;
      const result = await client.updateRecord('sc_task', args.sys_id, payload);
      return { ...result, summary: `Closed catalog task ${args.sys_id}` };
    }
    case 'list_catalog_categories': {
      const parts: string[] = [];
      if (args.catalog) parts.push(`sc_catalog=${args.catalog}`);
      if (args.query) parts.push(`titleCONTAINS${args.query}`);
      return await client.queryRecords({ table: 'sc_category', query: parts.join('^'), limit: args.limit ?? 50 });
    }
    case 'create_catalog_category': {
      requireWrite();
      if (!args.title) throw new ServiceNowError('title is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { title: args.title, ...(args.fields ?? {}) };
      if (args.catalog) payload.sc_catalog = args.catalog;
      if (args.description) payload.description = args.description;
      if (args.parent) payload.parent = args.parent;
      const result = await client.createRecord('sc_category', payload);
      return { ...result, summary: `Created catalog category "${args.title}"` };
    }
    case 'create_user_criteria': {
      requireWrite();
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const payload: Record<string, any> = { name: args.name, ...(args.fields ?? {}) };
      if (args.roles) payload.role = args.roles;
      if (args.groups) payload.group = args.groups;
      if (args.users) payload.user = args.users;
      if (args.match_all !== undefined) payload.match_all = args.match_all ? 'true' : 'false';
      const result = await client.createRecord('user_criteria', payload);
      return { ...result, summary: `Created user criteria "${args.name}"` };
    }
    case 'assign_user_criteria': {
      requireWrite();
      if (!args.catalog_item || !args.user_criteria) throw new ServiceNowError('catalog_item and user_criteria are required', 'INVALID_REQUEST');
      const result = await client.createRecord('sc_cat_item_user_criteria_mtom', {
        sc_cat_item: args.catalog_item,
        user_criteria: args.user_criteria,
      });
      return { ...result, summary: `Linked user criteria ${args.user_criteria} to catalog item ${args.catalog_item}` };
    }
    default:
      return null;
  }
}
