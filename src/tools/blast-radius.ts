/**
 * Blast Radius — static dependency / impact analysis over ServiceNow metadata.
 *
 * Answers "what will this change break?" BEFORE a delete, rename or refactor by tracing
 * references across the platform's config tables (business rules, client scripts, UI
 * policies, ACLs, UI actions, script includes, scheduled jobs, widgets) and update sets.
 *
 * All tools are read-only (they only query metadata tables), so no write tier is required.
 * Every sub-query is guarded individually — a missing plugin/table degrades that one lane
 * to an { error } note instead of failing the whole call.
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';

const BLAST_RADIUS_TOOL_NAMES = new Set([
  'blast_radius_table_configs',
  'blast_radius_field_references',
  'blast_radius_script_dependents',
  'blast_radius_update_sets',
  'blast_radius_property_usage',
]);

// Script-bearing config tables searched for textual references to an artifact/field.
const SCRIPT_TABLES: { table: string; field: string; label: string }[] = [
  { table: 'sys_script', field: 'script', label: 'business_rules' },
  { table: 'sys_script_include', field: 'script', label: 'script_includes' },
  { table: 'sys_script_client', field: 'script', label: 'client_scripts' },
  { table: 'sys_ui_action', field: 'script', label: 'ui_actions' },
  { table: 'sysauto_script', field: 'script', label: 'scheduled_jobs' },
  { table: 'sys_script_fix', field: 'script', label: 'fix_scripts' },
  { table: 'sp_widget', field: 'script', label: 'widgets' },
];

async function safeQuery(
  client: ServiceNowClient,
  table: string,
  query: string,
  fields: string,
  limit = 50,
): Promise<{ count: number; records: any[] } | { error: string }> {
  try {
    const resp = await client.queryRecords({ table, query, fields, limit });
    return { count: resp.count, records: resp.records };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'query failed' };
  }
}

export function getBlastRadiusToolDefinitions() {
  return [
    {
      name: 'blast_radius_table_configs',
      description: 'Blast radius: list every configuration artifact scoped to a table (business rules, client scripts, UI policies, ACLs, UI actions, data policies, dictionary fields). Run before altering or removing a table.',
      inputSchema: {
        type: 'object',
        properties: {
          table: { type: 'string', description: 'Table name, e.g. "incident"' },
          limit: { type: 'number', description: 'Max records per artifact type (default 50)' },
        },
        required: ['table'],
      },
    },
    {
      name: 'blast_radius_field_references',
      description: 'Blast radius: find where a table field is referenced — its dictionary entry plus any scripts (business rules, script includes, client scripts, UI actions, widgets) that mention the field name. Run before renaming or removing a field.',
      inputSchema: {
        type: 'object',
        properties: {
          table: { type: 'string', description: 'Table name, e.g. "incident"' },
          field: { type: 'string', description: 'Field (column) name, e.g. "u_custom_field"' },
          limit: { type: 'number', description: 'Max matches per source (default 50)' },
        },
        required: ['table', 'field'],
      },
    },
    {
      name: 'blast_radius_script_dependents',
      description: 'Blast radius: find what references a script include / artifact by name — scans script-bearing config tables for textual use of the name. Run before renaming or deleting a Script Include, Script Action, etc.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Artifact name to search for, e.g. a Script Include class name' },
          limit: { type: 'number', description: 'Max matches per source (default 50)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'blast_radius_update_sets',
      description: 'Blast radius: list the update sets that contain changes to an artifact (by name), so you know what is in-flight or already captured for promotion before you touch it.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Artifact name (or partial) to match against captured updates' },
          limit: { type: 'number', description: 'Max update records to scan (default 100)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'blast_radius_property_usage',
      description: 'Blast radius: find scripts that read a system property (sys_properties) by name, plus the property record itself. Run before changing or removing a property.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'System property name, e.g. "glide.ui.incident_reassignment_action"' },
          limit: { type: 'number', description: 'Max matches per source (default 50)' },
        },
        required: ['name'],
      },
    },
  ];
}

export async function executeBlastRadiusToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  if (!BLAST_RADIUS_TOOL_NAMES.has(name)) return null;

  switch (name) {
    case 'blast_radius_table_configs': {
      if (!args.table) throw new ServiceNowError('table is required', 'INVALID_REQUEST');
      const t = String(args.table);
      const limit = args.limit || 50;
      const [business_rules, client_scripts, ui_policies, acls, ui_actions, data_policies, dictionary_fields] = await Promise.all([
        safeQuery(client, 'sys_script', `collection=${t}`, 'sys_id,name,when,active', limit),
        safeQuery(client, 'sys_script_client', `table=${t}`, 'sys_id,name,type,active', limit),
        safeQuery(client, 'sys_ui_policy', `table=${t}`, 'sys_id,short_description,active', limit),
        safeQuery(client, 'sys_security_acl', `name=${t}^ORnameSTARTSWITH${t}.`, 'sys_id,name,operation,active', limit),
        safeQuery(client, 'sys_ui_action', `table=${t}`, 'sys_id,name,action_name,active', limit),
        safeQuery(client, 'sys_data_policy2', `table=${t}`, 'sys_id,short_description,active', limit),
        safeQuery(client, 'sys_dictionary', `name=${t}^elementISNOTEMPTY`, 'element,column_label,internal_type', limit),
      ]);
      const countOf = (r: any) => (r && typeof r.count === 'number' ? r.count : 0);
      return {
        table: t,
        summary: {
          business_rules: countOf(business_rules),
          client_scripts: countOf(client_scripts),
          ui_policies: countOf(ui_policies),
          acls: countOf(acls),
          ui_actions: countOf(ui_actions),
          data_policies: countOf(data_policies),
          dictionary_fields: countOf(dictionary_fields),
        },
        business_rules, client_scripts, ui_policies, acls, ui_actions, data_policies, dictionary_fields,
      };
    }

    case 'blast_radius_field_references': {
      if (!args.table || !args.field) throw new ServiceNowError('table and field are required', 'INVALID_REQUEST');
      const t = String(args.table); const f = String(args.field);
      const limit = args.limit || 50;
      const dictionary = await safeQuery(client, 'sys_dictionary', `name=${t}^element=${f}`, 'sys_id,element,column_label,internal_type,reference', 5);
      const references: Record<string, any> = {};
      await Promise.all(SCRIPT_TABLES.map(async (s) => {
        references[s.label] = await safeQuery(client, s.table, `${s.field}LIKE${f}`, 'sys_id,name', limit);
      }));
      return { table: t, field: f, dictionary, references };
    }

    case 'blast_radius_script_dependents': {
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const n = String(args.name);
      const limit = args.limit || 50;
      const dependents: Record<string, any> = {};
      await Promise.all(SCRIPT_TABLES.map(async (s) => {
        dependents[s.label] = await safeQuery(client, s.table, `${s.field}LIKE${n}`, 'sys_id,name', limit);
      }));
      const total = Object.values(dependents).reduce((a, r: any) => a + (r && typeof r.count === 'number' ? r.count : 0), 0);
      return { name: n, total_dependents: total, dependents };
    }

    case 'blast_radius_update_sets': {
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const n = String(args.name);
      const limit = args.limit || 100;
      const updates = await safeQuery(
        client,
        'sys_update_xml',
        `target_nameLIKE${n}^ORnameLIKE${n}`,
        'sys_id,name,target_name,type,action,update_set',
        limit,
      );
      const sets = new Map<string, { update_set: string; changes: number }>();
      if ('records' in updates) {
        for (const r of updates.records as any[]) {
          const us = r.update_set;
          const key = (us && typeof us === 'object' ? us.display_value || us.value : us) || 'unknown';
          const cur = sets.get(key) || { update_set: key, changes: 0 };
          cur.changes += 1;
          sets.set(key, cur);
        }
      }
      return { name: n, update_sets: Array.from(sets.values()), changes: updates };
    }

    case 'blast_radius_property_usage': {
      if (!args.name) throw new ServiceNowError('name is required', 'INVALID_REQUEST');
      const n = String(args.name);
      const limit = args.limit || 50;
      const property = await safeQuery(client, 'sys_properties', `name=${n}`, 'sys_id,name,value,description', 3);
      const usage: Record<string, any> = {};
      await Promise.all(SCRIPT_TABLES.map(async (s) => {
        usage[s.label] = await safeQuery(client, s.table, `${s.field}LIKE${n}`, 'sys_id,name', limit);
      }));
      return { name: n, property, usage };
    }

    default:
      return null;
  }
}
