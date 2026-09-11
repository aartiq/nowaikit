/**
 * Strategic Portfolio Management (SPM, formerly PPM) tools.
 *
 * These make the SPM layer first-class rather than requiring generic table access. Every table below
 * was verified on a live instance:
 *   pm_portfolio      — Portfolio
 *   pm_program        — Program (extends planned_task)
 *   pm_project        — Project (handled in agile.ts: create/list/update_project)
 *   pm_project_task   — Project Task (extends planned_task)
 *   dmn_demand        — Demand (extends task)
 *   sn_gf_goal        — Goal
 *   pm_m2m_portfolio_project — Portfolio to Project relationships
 *
 * Reads are Tier 0. Writes (create_demand) require WRITE_ENABLED=true.
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

// planned_task / task descendants share these fields.
const TASK_FIELDS = 'sys_id,number,short_description,state,priority,percent_complete,start_date,end_date,assigned_to';

export function getSpmToolDefinitions() {
  return [
    {
      name: 'list_portfolios',
      description: 'List Strategic Portfolio Management portfolios (pm_portfolio). SPM is the evolution of PPM.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional encoded query (e.g. active=true)' },
          limit: { type: 'number', description: 'Max records (default 20)' },
          fields: { type: 'string', description: 'Comma-separated fields to return' },
        },
      },
    },
    {
      name: 'get_portfolio',
      description: 'Get a portfolio (pm_portfolio) by sys_id, with the projects linked to it.',
      inputSchema: {
        type: 'object',
        properties: { sys_id: { type: 'string', description: 'sys_id of the portfolio' } },
        required: ['sys_id'],
      },
    },
    {
      name: 'list_programs',
      description: 'List SPM programs (pm_program).',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional encoded query' },
          limit: { type: 'number', description: 'Max records (default 20)' },
          fields: { type: 'string', description: 'Comma-separated fields to return' },
        },
      },
    },
    {
      name: 'list_demands',
      description: 'List SPM demands (dmn_demand) — the intake pipeline that feeds projects.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional encoded query (e.g. stateIN1,2)' },
          limit: { type: 'number', description: 'Max records (default 20)' },
          fields: { type: 'string', description: 'Comma-separated fields to return' },
        },
      },
    },
    {
      name: 'create_demand',
      description: 'Create an SPM demand (dmn_demand). Requires WRITE_ENABLED=true.',
      inputSchema: {
        type: 'object',
        properties: {
          short_description: { type: 'string', description: 'Demand title' },
          description: { type: 'string', description: 'Detailed description' },
          fields: { type: 'object', description: 'Additional dmn_demand field values' },
        },
        required: ['short_description'],
      },
    },
    {
      name: 'list_goals',
      description: 'List SPM goals (sn_gf_goal) — the strategic goals portfolios and programs align to.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional encoded query' },
          limit: { type: 'number', description: 'Max records (default 20)' },
          fields: { type: 'string', description: 'Comma-separated fields to return' },
        },
      },
    },
    {
      name: 'list_project_tasks',
      description: 'List project tasks (pm_project_task), optionally scoped to a parent project.',
      inputSchema: {
        type: 'object',
        properties: {
          project_sys_id: { type: 'string', description: 'sys_id of the parent project to scope to' },
          query: { type: 'string', description: 'Optional encoded query (combined with project scope)' },
          limit: { type: 'number', description: 'Max records (default 50)' },
        },
      },
    },
  ];
}

export async function executeSpmToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'list_portfolios': {
      const resp = await client.queryRecords({ table: 'pm_portfolio', query: args.query || undefined, limit: args.limit || 20, fields: args.fields || undefined });
      return { count: resp.count, portfolios: resp.records };
    }
    case 'get_portfolio': {
      if (!args.sys_id) throw new ServiceNowError('sys_id is required', 'INVALID_REQUEST');
      const portfolio = await client.getRecord('pm_portfolio', args.sys_id);
      // Linked projects via the m2m table (best-effort — absent on some releases).
      let projects: any[] = [];
      try {
        const m2m = await client.queryRecords({ table: 'pm_m2m_portfolio_project', query: `portfolio=${args.sys_id}`, limit: 200, fields: 'project' });
        projects = m2m.records || [];
      } catch { /* m2m table not present */ }
      return { portfolio, linked_project_count: projects.length, linked_projects: projects };
    }
    case 'list_programs': {
      const resp = await client.queryRecords({ table: 'pm_program', query: args.query || undefined, limit: args.limit || 20, fields: args.fields || TASK_FIELDS });
      return { count: resp.count, programs: resp.records };
    }
    case 'list_demands': {
      const resp = await client.queryRecords({ table: 'dmn_demand', query: args.query || undefined, limit: args.limit || 20, fields: args.fields || TASK_FIELDS });
      return { count: resp.count, demands: resp.records };
    }
    case 'create_demand': {
      requireWrite();
      if (!args.short_description) throw new ServiceNowError('short_description is required', 'INVALID_REQUEST');
      const data: Record<string, unknown> = { short_description: args.short_description, ...(args.fields || {}) };
      if (args.description) data.description = args.description;
      const result = await client.createRecord('dmn_demand', data);
      return { action: 'created', ...result, summary: `Created demand "${args.short_description}"` };
    }
    case 'list_goals': {
      const resp = await client.queryRecords({ table: 'sn_gf_goal', query: args.query || undefined, limit: args.limit || 20, fields: args.fields || undefined });
      return { count: resp.count, goals: resp.records };
    }
    case 'list_project_tasks': {
      const parts: string[] = [];
      if (args.project_sys_id) parts.push(`project=${args.project_sys_id}`);
      if (args.query) parts.push(args.query);
      const resp = await client.queryRecords({ table: 'pm_project_task', query: parts.join('^') || undefined, limit: args.limit || 50, fields: TASK_FIELDS });
      return { count: resp.count, project_tasks: resp.records };
    }
    default:
      return null;
  }
}
