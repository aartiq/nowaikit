/**
 * Local Sync — pull large ServiceNow artifacts (widgets, script includes, UI pages…)
 * to local files, edit them, and push them back. Avoids stuffing huge script/HTML
 * bodies through the model, and gives a git-style edit loop for pro-code work.
 *
 * File writes are confined to the directory in NOWAIKIT_SYNC_DIR. When that env var is
 * not set (e.g. a hosted multi-tenant server), pull returns content inline and push
 * expects the fields in the call — nothing touches the server filesystem.
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';
import { requireWrite } from '../utils/permissions.js';

const LOCAL_SYNC_TOOL_NAMES = new Set([
  'list_supported_artifacts', 'pull_artifact', 'push_artifact', 'sync_status',
]);

/** table -> { name field, syncable field -> file extension } */
const SUPPORTED: Record<string, { nameField: string; fields: Record<string, string> }> = {
  sp_widget: { nameField: 'name', fields: { template: 'html', css: 'css', script: 'js', client_script: 'js', link: 'js', option_schema: 'json', demo_data: 'json' } },
  sys_script_include: { nameField: 'name', fields: { script: 'js' } },
  sys_script: { nameField: 'name', fields: { script: 'js' } },
  sys_script_client: { nameField: 'name', fields: { script: 'js' } },
  sys_ui_action: { nameField: 'name', fields: { script: 'js' } },
  sys_ui_page: { nameField: 'name', fields: { html: 'html', client_script: 'js', processing_script: 'js' } },
  sys_ui_script: { nameField: 'name', fields: { script: 'js' } },
  sysauto_script: { nameField: 'name', fields: { script: 'js' } },
  sys_script_fix: { nameField: 'name', fields: { script: 'js' } },
};

function asString(v: any): string {
  if (v == null) return '';
  if (typeof v === 'object') return String(v.value ?? v.display_value ?? '');
  return String(v);
}

function syncDirFor(table: string, sysId: string): string | null {
  const base = process.env.NOWAIKIT_SYNC_DIR;
  if (!base) return null;
  if (!/^[0-9a-f]{32}$/i.test(sysId)) throw new ServiceNowError('sys_id must be a 32-char hex value for local sync', 'VALIDATION_ERROR');
  if (!/^[a-z0-9_]+$/i.test(table)) throw new ServiceNowError('invalid table name for local sync', 'VALIDATION_ERROR');
  return resolve(join(base, table, sysId));
}

export function getLocalSyncToolDefinitions() {
  return [
    {
      name: 'list_supported_artifacts',
      description: 'Local sync: list the artifact types (tables) that support pull/push to local files and which fields sync for each.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'pull_artifact',
      description: 'Local sync: fetch an artifact\'s editable fields (e.g. a Service Portal widget\'s template/css/script). Returns the content inline; when NOWAIKIT_SYNC_DIR is set it also writes one file per field and returns the paths.',
      inputSchema: {
        type: 'object',
        properties: {
          table: { type: 'string', description: 'Artifact table, e.g. "sp_widget", "sys_script_include"' },
          sys_id: { type: 'string', description: 'sys_id of the record' },
        },
        required: ['table', 'sys_id'],
      },
    },
    {
      name: 'push_artifact',
      description: 'Local sync: write edited fields back to an artifact (requires WRITE_ENABLED=true). Pass fields inline as {field:value}; if omitted and NOWAIKIT_SYNC_DIR is set, reads them from the pulled files on disk.',
      inputSchema: {
        type: 'object',
        properties: {
          table: { type: 'string', description: 'Artifact table' },
          sys_id: { type: 'string', description: 'sys_id of the record' },
          fields: { type: 'object', description: 'Optional map of {field: newValue} to update; defaults to the on-disk files under NOWAIKIT_SYNC_DIR' },
        },
        required: ['table', 'sys_id'],
      },
    },
    {
      name: 'sync_status',
      description: 'Local sync: compare an artifact\'s current instance content against your local/edited content field-by-field and report which fields changed.',
      inputSchema: {
        type: 'object',
        properties: {
          table: { type: 'string', description: 'Artifact table' },
          sys_id: { type: 'string', description: 'sys_id of the record' },
          fields: { type: 'object', description: 'Optional {field: localValue} to compare; defaults to files under NOWAIKIT_SYNC_DIR' },
        },
        required: ['table', 'sys_id'],
      },
    },
  ];
}

function specFor(table: string) {
  const spec = SUPPORTED[table];
  if (!spec) {
    throw new ServiceNowError(`Artifact table not supported for local sync: ${table}. Call list_supported_artifacts.`, 'INVALID_REQUEST');
  }
  return spec;
}

export async function executeLocalSyncToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  if (!LOCAL_SYNC_TOOL_NAMES.has(name)) return null;

  switch (name) {
    case 'list_supported_artifacts': {
      return {
        sync_dir: process.env.NOWAIKIT_SYNC_DIR || null,
        artifacts: Object.entries(SUPPORTED).map(([table, spec]) => ({
          table,
          fields: Object.keys(spec.fields),
        })),
      };
    }

    case 'pull_artifact': {
      if (!args.table || !args.sys_id) throw new ServiceNowError('table and sys_id are required', 'INVALID_REQUEST');
      const spec = specFor(String(args.table));
      const fieldNames = Object.keys(spec.fields);
      const record = await client.getRecord(String(args.table), String(args.sys_id), [spec.nameField, ...fieldNames].join(','));
      const content: Record<string, string> = {};
      for (const f of fieldNames) content[f] = asString((record as any)[f]);

      const dir = syncDirFor(String(args.table), String(args.sys_id));
      let files: string[] | undefined;
      if (dir) {
        mkdirSync(dir, { recursive: true });
        files = [];
        for (const f of fieldNames) {
          const path = join(dir, `${f}.${spec.fields[f]}`);
          writeFileSync(path, content[f], 'utf8');
          files.push(path);
        }
      }
      return {
        table: args.table,
        sys_id: args.sys_id,
        name: asString((record as any)[spec.nameField]),
        fields: content,
        files,
        note: dir ? `Wrote ${fieldNames.length} files under ${dir}` : 'NOWAIKIT_SYNC_DIR not set; content returned inline only.',
      };
    }

    case 'push_artifact': {
      requireWrite();
      if (!args.table || !args.sys_id) throw new ServiceNowError('table and sys_id are required', 'INVALID_REQUEST');
      const spec = specFor(String(args.table));
      const fieldNames = Object.keys(spec.fields);

      let updates: Record<string, string> = {};
      if (args.fields && typeof args.fields === 'object') {
        for (const [k, v] of Object.entries(args.fields)) {
          if (fieldNames.includes(k)) updates[k] = asString(v);
        }
      } else {
        const dir = syncDirFor(String(args.table), String(args.sys_id));
        if (!dir) throw new ServiceNowError('Provide fields inline, or set NOWAIKIT_SYNC_DIR and pull_artifact first.', 'INVALID_REQUEST');
        for (const f of fieldNames) {
          const path = join(dir, `${f}.${spec.fields[f]}`);
          if (existsSync(path)) updates[f] = readFileSync(path, 'utf8');
        }
      }
      if (Object.keys(updates).length === 0) throw new ServiceNowError('No syncable fields to push.', 'INVALID_REQUEST');
      await client.updateRecord(String(args.table), String(args.sys_id), updates);
      return { table: args.table, sys_id: args.sys_id, updated_fields: Object.keys(updates) };
    }

    case 'sync_status': {
      if (!args.table || !args.sys_id) throw new ServiceNowError('table and sys_id are required', 'INVALID_REQUEST');
      const spec = specFor(String(args.table));
      const fieldNames = Object.keys(spec.fields);
      const record = await client.getRecord(String(args.table), String(args.sys_id), fieldNames.join(','));

      let local: Record<string, string> | null = null;
      if (args.fields && typeof args.fields === 'object') {
        local = {};
        for (const [k, v] of Object.entries(args.fields)) if (fieldNames.includes(k)) local[k] = asString(v);
      } else {
        const dir = syncDirFor(String(args.table), String(args.sys_id));
        if (dir) {
          local = {};
          for (const f of fieldNames) {
            const path = join(dir, `${f}.${spec.fields[f]}`);
            if (existsSync(path)) local[f] = readFileSync(path, 'utf8');
          }
        }
      }
      if (!local) throw new ServiceNowError('Provide fields inline, or set NOWAIKIT_SYNC_DIR.', 'INVALID_REQUEST');

      const status = fieldNames.map((f) => {
        const instance = asString((record as any)[f]);
        const localVal = local![f];
        return {
          field: f,
          state: localVal === undefined ? 'not_local' : localVal === instance ? 'unchanged' : 'changed',
        };
      });
      return { table: args.table, sys_id: args.sys_id, changed: status.filter((s) => s.state === 'changed').map((s) => s.field), status };
    }

    default:
      return null;
  }
}
