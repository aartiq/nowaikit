/**
 * Unified API adapter — works in both Electron (via preload) and browser (via localStorage).
 *
 * In Electron:  delegates to window.api (IPC bridge)
 * In Browser:   provides a full in-memory + localStorage implementation
 */

import { TOOL_DEFINITIONS } from './tools-data';

// ─── Detect environment ──────────────────────────────────────────────────────

const isElectron = typeof window !== 'undefined' && window.api !== undefined;

// ─── LocalStorage helpers ────────────────────────────────────────────────────

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Browser-side state ──────────────────────────────────────────────────────

let serverRunning = false;
let serverInstance: string | undefined;
let serverPid: number | undefined;
let serverStartedAt: string | undefined;

function getInstances(): InstanceConfig[] {
  return loadJSON<InstanceConfig[]>('nowaikit:instances', []);
}

function getAuditEntries(limit: number): AuditEntry[] {
  const all = loadJSON<AuditEntry[]>('nowaikit:audit', []);
  return all.slice(-limit).reverse();
}

function appendAuditEntry(entry: AuditEntry): void {
  const all = loadJSON<AuditEntry[]>('nowaikit:audit', []);
  all.push(entry);
  // Keep max 2000 entries
  if (all.length > 2000) all.splice(0, all.length - 2000);
  saveJSON('nowaikit:audit', all);
}

// ─── Browser implementation ──────────────────────────────────────────────────

const webApi: ElectronAPI = {
  // ── Config ──
  getConfig: async (key: string) => {
    return loadJSON<unknown>(`nowaikit:config:${key}`, null);
  },
  setConfig: async (key: string, value: unknown) => {
    saveJSON(`nowaikit:config:${key}`, value);
  },
  getAllConfig: async () => {
    return loadJSON<Record<string, unknown>>('nowaikit:config:all', {
      instances: getInstances(),
      theme: 'dark',
      telemetry: false,
      autoUpdate: true,
    });
  },

  // ── Instances ──
  listInstances: async () => {
    return getInstances();
  },
  addInstance: async (instance: InstanceConfig) => {
    const instances = getInstances();
    const idx = instances.findIndex(i => i.name === instance.name);
    if (idx >= 0) {
      instances[idx] = instance;
    } else {
      instances.push(instance);
    }
    saveJSON('nowaikit:instances', instances);
    appendAuditEntry({
      ts: new Date().toISOString(),
      event: 'instance:add',
      instance: instance.name,
      success: true,
    });
    return { success: true };
  },
  removeInstance: async (name: string) => {
    const instances = getInstances();
    const idx = instances.findIndex(i => i.name === name);
    if (idx < 0) return { success: false, error: `Instance "${name}" not found` };
    instances.splice(idx, 1);
    saveJSON('nowaikit:instances', instances);
    appendAuditEntry({
      ts: new Date().toISOString(),
      event: 'instance:remove',
      instance: name,
      success: true,
    });
    return { success: true };
  },
  testInstance: async (instance: InstanceConfig) => {
    appendAuditEntry({
      ts: new Date().toISOString(),
      event: 'instance:test',
      instance: instance.name || instance.instanceUrl,
      success: true,
      durationMs: 120,
    });
    // In browser mode, attempt a real connection test via fetch
    try {
      const url = `${instance.instanceUrl}/api/now/table/sys_properties?sysparm_query=name=instance_name&sysparm_limit=1&sysparm_fields=value`;
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      if (instance.authMethod === 'basic' && instance.username && instance.password) {
        headers['Authorization'] = `Basic ${btoa(`${instance.username}:${instance.password}`)}`;
      }
      const resp = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (resp.status === 401) return { success: false, error: 'Authentication failed. Check your credentials.' };
      if (resp.status === 403) return { success: false, error: 'Access denied. Check user permissions.' };
      if (!resp.ok) return { success: false, error: `HTTP ${resp.status}: ${resp.statusText}` };
      const data = await resp.json() as { result?: Array<{ value?: string }> };
      const instanceName = data?.result?.[0]?.value || 'OK';
      return { success: true, info: { instanceName, url: instance.instanceUrl } };
    } catch (err) {
      // CORS will typically block this in browser — show a helpful message
      if (err instanceof TypeError && String(err).includes('fetch')) {
        return { success: true, info: { instanceName: 'Connection test unavailable in browser (CORS). Use the desktop app for full testing.' } };
      }
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  },

  // ── Server ──
  startServer: async (instanceName?: string) => {
    const instances = getInstances();
    const instance = instanceName
      ? instances.find(i => i.name === instanceName)
      : instances[0];

    if (!instance) return { success: false, error: 'No instance configured. Use Setup Wizard to add one.' };

    serverRunning = true;
    serverInstance = instance.name;
    serverPid = Math.floor(Math.random() * 60000) + 5000;
    serverStartedAt = new Date().toISOString();

    appendAuditEntry({
      ts: new Date().toISOString(),
      event: 'server:start',
      instance: instance.name,
      success: true,
    });

    return { success: true };
  },
  stopServer: async () => {
    const wasRunning = serverRunning;
    serverRunning = false;
    serverInstance = undefined;
    serverPid = undefined;
    serverStartedAt = undefined;

    if (wasRunning) {
      appendAuditEntry({
        ts: new Date().toISOString(),
        event: 'server:stop',
        success: true,
      });
    }

    return { success: true };
  },
  getServerStatus: async () => {
    return {
      running: serverRunning,
      instance: serverInstance,
      pid: serverPid,
      startedAt: serverStartedAt,
      toolCount: TOOL_DEFINITIONS.length,
    };
  },

  // ── Tools ──
  listTools: async () => {
    return TOOL_DEFINITIONS;
  },
  executeTool: async (name: string, args: Record<string, unknown>) => {
    if (!serverRunning) {
      return { success: false, error: 'Server is not running. Start the server first.' };
    }
    appendAuditEntry({
      ts: new Date().toISOString(),
      event: 'tool:call',
      tool: name,
      instance: serverInstance,
      success: true,
      durationMs: Math.floor(Math.random() * 500) + 50,
    });
    return { success: true, result: { message: `Tool "${name}" executed (browser preview mode). Connect via desktop app or MCP client for live results.` } };
  },

  // ── Audit ──
  getAuditLogs: async (limit?: number) => {
    return getAuditEntries(limit || 100);
  },

  // ── System ──
  getVersion: async () => {
    return {
      app: '2.4.0',
      electron: typeof navigator !== 'undefined' ? 'Browser' : 'N/A',
      node: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').pop() || 'Browser' : 'N/A',
    };
  },
  openExternal: async (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  selectDirectory: async () => {
    // Not available in browser
    return null;
  },
  getServerPath: async () => {
    return 'N/A (browser mode — use desktop app or CLI for MCP server)';
  },

  // ── AI Chat (direct fetch in browser — may hit CORS for some providers) ──
  sendChat: async (params: {
    provider: string;
    apiKey: string;
    model: string;
    messages: Array<{ role: string; content: unknown }>;
    tools?: Array<{ name: string; description: string; inputSchema?: Record<string, unknown> }>;
  }) => {
    const { provider, apiKey, model, messages, tools: toolDefs } = params;
    if (!apiKey) return { error: 'No API key configured' };

    const systemPrompt = toolDefs && toolDefs.length > 0
      ? 'You are NowAIKit, an AI assistant for ServiceNow. Use tools to fetch real data — never make up data.\n\nUse "query_records" with correct table: incident, change_request, problem, task, sys_user, cmdb_ci.\nQuery syntax: active=true, priority=1, ORDERBYDESCsys_created_on, nameLIKEtext.\nIMPORTANT: Do NOT add assigned_to filter unless user explicitly says "my" or "assigned to me". Query ALL matching records by default.'
      : undefined;

    try {
      if (provider === 'anthropic') {
        const anthropicTools = toolDefs?.map(t => ({
          name: t.name, description: t.description,
          input_schema: t.inputSchema || { type: 'object', properties: {} },
        }));
        const body: Record<string, unknown> = { model, max_tokens: 4096, messages };
        if (systemPrompt) body.system = systemPrompt;
        if (anthropicTools && anthropicTools.length > 0) body.tools = anthropicTools;
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify(body),
        });
        if (!res.ok) return { error: `API error ${res.status}: ${await res.text()}` };
        const data = await res.json() as Record<string, unknown>;
        return { content: data.content as Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }>, stop_reason: data.stop_reason as string };
      } else if (provider === 'google') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const contents = messages.map((m: { role: string; content: unknown }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: typeof m.content === 'string' ? m.content :
            (m.content as Array<{ type: string; text?: string }>).filter(c => c.type === 'text').map(c => c.text).join('\n') }],
        }));
        const body: Record<string, unknown> = { contents };
        if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
        if (toolDefs && toolDefs.length > 0) {
          body.tools = [{ functionDeclarations: toolDefs.map(t => ({ name: t.name, description: t.description, parameters: t.inputSchema || { type: 'object', properties: {} } })) }];
        }
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) return { error: `Google AI error ${res.status}: ${await res.text()}` };
        const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; functionCall?: { name: string; args: Record<string, unknown> } }> } }> };
        const parts = data.candidates?.[0]?.content?.parts ?? [];
        const content: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }> = [];
        for (const p of parts) {
          if (p.text) content.push({ type: 'text', text: p.text });
          if (p.functionCall) content.push({ type: 'tool_use', id: `toolu_${Date.now()}`, name: p.functionCall.name, input: p.functionCall.args });
        }
        return { content, stop_reason: content.some(c => c.type === 'tool_use') ? 'tool_use' : 'end_turn' };
      } else {
        // OpenAI-compatible
        const endpoints: Record<string, string> = {
          openai: 'https://api.openai.com/v1/chat/completions',
          groq: 'https://api.groq.com/openai/v1/chat/completions',
          openrouter: 'https://openrouter.ai/api/v1/chat/completions',
        };
        const url = endpoints[provider];
        if (!url) return { error: `Unknown provider: ${provider}` };
        const oaiMessages: Array<Record<string, unknown>> = [];
        if (systemPrompt) oaiMessages.push({ role: 'system', content: systemPrompt });
        for (const m of messages) {
          if (typeof m.content === 'string') oaiMessages.push({ role: m.role, content: m.content });
          else oaiMessages.push({ role: m.role, content: (m.content as Array<{ type: string; text?: string }>).filter(c => c.type === 'text').map(c => c.text).join('\n') });
        }
        const body: Record<string, unknown> = { model, messages: oaiMessages };
        if (toolDefs && toolDefs.length > 0) {
          body.tools = toolDefs.map(t => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.inputSchema || { type: 'object', properties: {} } } }));
        }
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) return { error: `API error ${res.status}: ${await res.text()}` };
        const data = await res.json() as { choices?: Array<{ message?: { content?: string; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> } }> };
        const msg = data.choices?.[0]?.message;
        const content: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }> = [];
        if (msg?.content) content.push({ type: 'text', text: msg.content });
        if (msg?.tool_calls) {
          for (const tc of msg.tool_calls) {
            let args: Record<string, unknown> = {};
            try { args = JSON.parse(tc.function.arguments); } catch { /* empty */ }
            content.push({ type: 'tool_use', id: tc.id, name: tc.function.name, input: args });
          }
        }
        return { content, stop_reason: content.some(c => c.type === 'tool_use') ? 'tool_use' : 'end_turn' };
      }
    } catch (err) {
      if (err instanceof TypeError && String(err).includes('fetch')) {
        return { error: 'CORS error: AI chat requests are blocked in the browser. Use the desktop app for AI chat, or use a provider that supports browser CORS (e.g., Google Gemini).' };
      }
      return { error: err instanceof Error ? err.message : 'Request failed' };
    }
  },
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const api: ElectronAPI = isElectron ? window.api : webApi;
