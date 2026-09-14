#!/usr/bin/env node
/**
 * Benchmark a bundled outcome tool vs the equivalent chain of query_records, to back the efficiency
 * claim (ServiceNow's MCP GA leans on fewer tokens / fewer calls). Read-only, runs against a live
 * instance. The key number is round trips: the model makes ONE tool call for the bundle, versus one
 * call per query in the chained path, and each extra round trip carries its own reasoning + tool-call
 * framing tokens on the AI side. We also report response bytes and an approximate token count.
 *
 * Usage (basic auth, read-only account is fine):
 *   SN_INSTANCE_URL=https://your.service-now.com SN_USER=admin SN_PASS=secret \
 *     node scripts/benchmark-bundles.mjs INC0000060
 *
 * Build first (uses the compiled dist): npm run build
 */
import { ServiceNowClient } from '../dist/servicenow/client.js';
import { executeBundleToolCall } from '../dist/tools/bundles.js';

const instanceUrl = process.env.SN_INSTANCE_URL;
const username = process.env.SN_USER;
const password = process.env.SN_PASS;
const number = process.argv[2] || 'INC0000060';

if (!instanceUrl || !username || !password) {
  console.error('Set SN_INSTANCE_URL, SN_USER, SN_PASS. See the header of this file.');
  process.exit(1);
}

const client = new ServiceNowClient({ instanceUrl, authMethod: 'basic', basic: { username, password } });

const bytes = (o) => Buffer.byteLength(JSON.stringify(o ?? ''), 'utf8');
const approxTokens = (b) => Math.round(b / 4); // rough proxy: ~4 bytes/token

async function timed(fn) { const t0 = Date.now(); const r = await fn(); return { ms: Date.now() - t0, r }; }

// The chained path: what an AI does WITHOUT the bundle — one tool call per query, sequentially.
async function chained() {
  let calls = 0, total = 0;
  const inc = await client.queryRecords({ table: 'incident', query: `number=${number}`, limit: 1, displayValue: 'all' }); calls++; total += bytes(inc);
  const rec = inc.records?.[0] || {};
  const v = (f) => { const x = rec[f]; return x && typeof x === 'object' ? (x.value ?? x.display_value) : x; };
  const category = v('category'); const ci = v('cmdb_ci'); const sid = v('sys_id');
  const sim = await client.queryRecords({ table: 'incident', query: (category ? `category=${category}^` : '') + `sys_id!=${sid}^ORDERBYDESCsys_created_on`, limit: 5, fields: 'number,short_description,state,priority', displayValue: 'all' }); calls++; total += bytes(sim);
  if (ci) {
    const c = await client.getRecord('cmdb_ci', ci, 'sys_id,name,sys_class_name'); calls++; total += bytes(c);
    const rel = await client.queryRecords({ table: 'cmdb_rel_ci', query: `parent=${ci}^ORchild=${ci}`, limit: 20, fields: 'type,parent,child', displayValue: 'all' }); calls++; total += bytes(rel);
  }
  const kw = String(v('short_description') || '').split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(' ');
  if (kw) { const kb = await client.queryRecords({ table: 'kb_knowledge', query: `workflow_state=published^short_descriptionLIKE${kw}`, limit: 3, fields: 'number,short_description' }); calls++; total += bytes(kb); }
  return { calls, total };
}

console.log(`Benchmark: investigate_incident vs chained query_records, incident ${number}\n`);

const b = await timed(() => executeBundleToolCall(client, 'investigate_incident', { number_or_sysid: number }));
const bBytes = bytes(b.r);
const c = await timed(() => chained());

console.log('Bundled (investigate_incident):');
console.log(`  model tool calls : 1`);
console.log(`  response bytes   : ${bBytes}  (~${approxTokens(bBytes)} tokens)`);
console.log(`  wall clock       : ${b.ms} ms\n`);

console.log('Chained (what the model does without the bundle):');
console.log(`  model tool calls : ${c.r.calls}`);
console.log(`  response bytes   : ${c.r.total}  (~${approxTokens(c.r.total)} tokens)`);
console.log(`  wall clock       : ${c.ms} ms\n`);

const callReduction = Math.round((1 - 1 / c.r.calls) * 100);
console.log('Result:');
console.log(`  round trips: 1 vs ${c.r.calls}  (${callReduction}% fewer model tool calls)`);
console.log(`  each avoided round trip also saves the reasoning + tool-call framing tokens on the AI side.`);
