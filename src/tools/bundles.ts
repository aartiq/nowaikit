/**
 * Bundled outcome tools — one call that answers a whole question, instead of the AI making several
 * query_records round trips (the read-query-reason-retry loop). These reduce tokens and latency by
 * assembling related context server-side in the gateway. Each sub-lookup is best-effort: a failure in
 * one section degrades gracefully rather than failing the whole call.
 */
import type { ServiceNowClient } from '../servicenow/client.js';
import { ServiceNowError } from '../utils/errors.js';

export function getBundleToolDefinitions() {
  return [
    {
      name: 'investigate_incident',
      description: 'One-call incident investigation. Returns the incident, similar recent incidents, the affected CI with its relationships, and related knowledge articles, so the assistant does not have to chain several queries. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          number_or_sysid: { type: 'string', description: 'Incident number (INC...) or sys_id' },
        },
        required: ['number_or_sysid'],
      },
    },
  ];
}

export async function executeBundleToolCall(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>,
): Promise<any> {
  switch (name) {
    case 'investigate_incident': {
      if (!args.number_or_sysid) throw new ServiceNowError('number_or_sysid is required', 'INVALID_REQUEST');

      // 1. Resolve the incident.
      let incident: any;
      if (/^[0-9a-f]{32}$/i.test(args.number_or_sysid)) {
        incident = await client.getRecord('incident', args.number_or_sysid, undefined, 'all');
      } else {
        const r = await client.queryRecords({ table: 'incident', query: `number=${args.number_or_sysid}^ORsys_id=${args.number_or_sysid}`, limit: 1, displayValue: 'all' });
        if (r.count === 0) throw new ServiceNowError(`Incident not found: ${args.number_or_sysid}`, 'NOT_FOUND');
        incident = r.records[0];
      }
      const val = (f: string): string => { const v = incident?.[f]; return v && typeof v === 'object' ? String(v.value ?? v.display_value ?? '') : String(v ?? ''); };
      const sysId = val('sys_id');
      const category = val('category');
      const ciSysId = val('cmdb_ci');

      const result: Record<string, any> = { incident };

      // 2. Similar recent incidents (same category, excluding this one, newest first).
      try {
        const q = (category ? `category=${category}^` : '') + `sys_id!=${sysId}^ORDERBYDESCsys_created_on`;
        const sim = await client.queryRecords({ table: 'incident', query: q, limit: 5, fields: 'number,short_description,state,priority,sys_created_on', displayValue: 'all' });
        result.similar_incidents = sim.records;
      } catch { result.similar_incidents = []; }

      // 3. Affected CI + its direct relationships.
      if (ciSysId) {
        try {
          const ci = await client.getRecord('cmdb_ci', ciSysId, 'sys_id,name,sys_class_name,operational_status');
          let rels: any[] = [];
          try {
            const rr = await client.queryRecords({ table: 'cmdb_rel_ci', query: `parent=${ciSysId}^ORchild=${ciSysId}`, limit: 20, fields: 'type,parent,child', displayValue: 'all' });
            rels = rr.records || [];
          } catch { /* no rel access */ }
          result.affected_ci = { ci, relationship_count: rels.length, relationships: rels };
        } catch { result.affected_ci = null; }
      } else {
        result.affected_ci = null;
      }

      // 4. Related published knowledge (match on the first couple of significant words).
      try {
        const kw = val('short_description').split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(' ');
        if (kw) {
          const kb = await client.queryRecords({ table: 'kb_knowledge', query: `workflow_state=published^short_descriptionLIKE${kw}`, limit: 3, fields: 'number,short_description,sys_id' });
          result.related_knowledge = kb.records;
        } else { result.related_knowledge = []; }
      } catch { result.related_knowledge = []; }

      result.summary = `Investigated ${val('number') || sysId}: ${result.similar_incidents.length} similar incident(s), ${result.affected_ci ? `affected CI with ${result.affected_ci.relationship_count} relationship(s)` : 'no linked CI'}, ${result.related_knowledge.length} related article(s). Assembled in one call.`;
      return result;
    }
    default:
      return null;
  }
}
