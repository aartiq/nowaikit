import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { join } from 'path';
import { existsSync } from 'fs';
import { ServerManager } from './server-manager';
import { ConfigStore } from './config-store';

const isDev = process.argv.includes('--dev');
let mainWindow: BrowserWindow | null = null;
const serverManager = new ServerManager();
const configStore = new ConfigStore();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'NowAIKit',
    icon: join(__dirname, '..', '..', 'resources', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(__dirname, '..', '..', 'renderer', 'dist', 'index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── App lifecycle ───────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  serverManager.stopAll();
  if (process.platform !== 'darwin') app.quit();
});

// ─── IPC Handlers ────────────────────────────────────────────────────────────

function registerIpcHandlers() {
  // ── Config ──
  ipcMain.handle('config:get', (_event, key: string) => {
    return configStore.get(key);
  });

  ipcMain.handle('config:set', (_event, key: string, value: unknown) => {
    configStore.set(key, value);
  });

  ipcMain.handle('config:getAll', () => {
    return configStore.getAll();
  });

  // ── Instances ──
  ipcMain.handle('instances:list', () => {
    return configStore.getInstances();
  });

  ipcMain.handle('instances:add', (_event, instance: InstanceConfig) => {
    return configStore.addInstance(instance);
  });

  ipcMain.handle('instances:remove', (_event, name: string) => {
    return configStore.removeInstance(name);
  });

  ipcMain.handle('instances:test', async (_event, instance: InstanceConfig) => {
    return serverManager.testConnection(instance);
  });

  // ── Server ──
  ipcMain.handle('server:start', async (_event, instanceName?: string) => {
    const instances = configStore.getInstances();
    const instance = instanceName
      ? instances.find(i => i.name === instanceName)
      : instances[0];

    if (!instance) return { success: false, error: 'No instance configured' };
    return serverManager.start(instance);
  });

  ipcMain.handle('server:stop', async () => {
    serverManager.stopAll();
    return { success: true };
  });

  ipcMain.handle('server:status', () => {
    return serverManager.getStatus();
  });

  // ── Tools ──
  ipcMain.handle('tools:list', async () => {
    return serverManager.listTools();
  });

  ipcMain.handle('tools:execute', async (_event, toolName: string, args: Record<string, unknown>) => {
    return serverManager.executeTool(toolName, args);
  });

  // ── Audit Log ──
  ipcMain.handle('audit:getLogs', async (_event, limit?: number) => {
    return configStore.getAuditLogs(limit || 100);
  });

  // ── System ──
  ipcMain.handle('system:getVersion', () => {
    return { app: app.getVersion(), electron: process.versions.electron, node: process.versions.node };
  });

  ipcMain.handle('system:openExternal', (_event, url: string) => {
    shell.openExternal(url);
  });

  ipcMain.handle('system:selectDirectory', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('system:getServerPath', () => {
    // In packaged app, server is in resources/server/
    const packagedPath = join(process.resourcesPath, 'server', 'server.js');
    const devPath = join(__dirname, '..', '..', 'dist', 'server.js');
    return existsSync(packagedPath) ? packagedPath : devPath;
  });

  // ── AI Chat (proxy through main process to avoid CORS) ──
  // Supports tool definitions for function calling / tool-use across all providers.
  // The renderer handles the tool execution loop (tool_use → executeTool → tool_result → repeat).
  ipcMain.handle('chat:send', async (_event, params: {
    provider: string;
    apiKey: string;
    model: string;
    messages: Array<{ role: string; content: unknown }>;
    tools?: Array<{ name: string; description: string; inputSchema?: Record<string, unknown> }>;
  }) => {
    const { provider, apiKey, model, messages, tools: toolDefs } = params;
    if (!apiKey) return { error: 'No API key configured' };

    // System prompt that instructs the AI to use ServiceNow tools
    const systemPrompt = toolDefs && toolDefs.length > 0
      ? 'You are NowAIKit, an AI assistant for ServiceNow. You have access to tools that can query and modify a ServiceNow instance. When the user asks about incidents, changes, users, CIs, or any ServiceNow data, ALWAYS use the appropriate tools to fetch real data from their instance. Never make up data — use the tools provided. After getting tool results, summarize the data clearly for the user.'
      : undefined;

    // Build Anthropic-format tool definitions
    const anthropicTools = toolDefs?.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema || { type: 'object', properties: {} },
    }));

    // Build OpenAI-format tool definitions
    const openaiTools = toolDefs?.map(t => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema || { type: 'object', properties: {} },
      },
    }));

    try {
      if (provider === 'anthropic') {
        const body: Record<string, unknown> = { model, max_tokens: 4096, messages };
        if (systemPrompt) body.system = systemPrompt;
        if (anthropicTools && anthropicTools.length > 0) body.tools = anthropicTools;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) return { error: `API error ${res.status}: ${await res.text()}` };
        const data = await res.json() as Record<string, unknown>;
        // Return full content array (may include tool_use blocks)
        return { content: data.content, stop_reason: data.stop_reason };

      } else if (provider === 'google') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Convert messages to Google format
        const contents = messages.map((m: { role: string; content: unknown }) => {
          const parts: Array<Record<string, unknown>> = [];
          if (typeof m.content === 'string') {
            parts.push({ text: m.content });
          } else if (Array.isArray(m.content)) {
            for (const c of m.content as Array<Record<string, unknown>>) {
              if (c.type === 'text') parts.push({ text: c.text });
              else if (c.type === 'tool_use') parts.push({ functionCall: { name: c.name, args: c.input } });
              else if (c.type === 'tool_result') parts.push({ functionResponse: { name: 'tool', response: { content: c.content } } });
            }
          }
          return { role: m.role === 'assistant' ? 'model' : 'user', parts };
        });

        const body: Record<string, unknown> = { contents };
        if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
        if (toolDefs && toolDefs.length > 0) {
          body.tools = [{
            functionDeclarations: toolDefs.map(t => ({
              name: t.name,
              description: t.description,
              parameters: t.inputSchema || { type: 'object', properties: {} },
            })),
          }];
        }

        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) return { error: `Google AI error ${res.status}: ${await res.text()}` };
        const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; functionCall?: { name: string; args: Record<string, unknown> } }> } }> };
        const parts = data.candidates?.[0]?.content?.parts ?? [];

        // Convert Google response to Anthropic-like content format
        const content: Array<Record<string, unknown>> = [];
        for (const p of parts) {
          if (p.text) content.push({ type: 'text', text: p.text });
          if (p.functionCall) content.push({ type: 'tool_use', id: `toolu_${Date.now()}`, name: p.functionCall.name, input: p.functionCall.args });
        }
        const hasToolUse = content.some(c => c.type === 'tool_use');
        return { content, stop_reason: hasToolUse ? 'tool_use' : 'end_turn' };

      } else {
        // OpenAI-compatible (OpenAI, Groq, OpenRouter)
        const endpoints: Record<string, string> = {
          openai: 'https://api.openai.com/v1/chat/completions',
          groq: 'https://api.groq.com/openai/v1/chat/completions',
          openrouter: 'https://openrouter.ai/api/v1/chat/completions',
        };
        const url = endpoints[provider];
        if (!url) return { error: `Unknown provider: ${provider}` };

        // Convert messages: tool_use/tool_result → OpenAI format
        const oaiMessages: Array<Record<string, unknown>> = [];
        if (systemPrompt) oaiMessages.push({ role: 'system', content: systemPrompt });
        for (const m of messages) {
          if (typeof m.content === 'string') {
            oaiMessages.push({ role: m.role, content: m.content });
          } else if (Array.isArray(m.content)) {
            const parts = m.content as Array<Record<string, unknown>>;
            const textParts = parts.filter(c => c.type === 'text').map(c => c.text).join('\n');
            const toolUses = parts.filter(c => c.type === 'tool_use');
            const toolResults = parts.filter(c => c.type === 'tool_result');

            if (toolUses.length > 0) {
              // Assistant message with tool calls
              oaiMessages.push({
                role: 'assistant',
                content: textParts || null,
                tool_calls: toolUses.map(tu => ({
                  id: tu.id,
                  type: 'function',
                  function: { name: tu.name, arguments: JSON.stringify(tu.input) },
                })),
              });
            } else if (toolResults.length > 0) {
              // Tool result messages
              for (const tr of toolResults) {
                oaiMessages.push({ role: 'tool', tool_call_id: tr.tool_use_id, content: typeof tr.content === 'string' ? tr.content : JSON.stringify(tr.content) });
              }
            } else if (textParts) {
              oaiMessages.push({ role: m.role, content: textParts });
            }
          }
        }

        const body: Record<string, unknown> = { model, messages: oaiMessages };
        if (openaiTools && openaiTools.length > 0) body.tools = openaiTools;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify(body),
        });
        if (!res.ok) return { error: `API error ${res.status}: ${await res.text()}` };
        const data = await res.json() as { choices?: Array<{ message?: { content?: string; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> }; finish_reason?: string }> };
        const choice = data.choices?.[0];
        const msg = choice?.message;

        // Convert OpenAI response to Anthropic-like format
        const content: Array<Record<string, unknown>> = [];
        if (msg?.content) content.push({ type: 'text', text: msg.content });
        if (msg?.tool_calls) {
          for (const tc of msg.tool_calls) {
            let args: Record<string, unknown> = {};
            try { args = JSON.parse(tc.function.arguments); } catch { /* empty */ }
            content.push({ type: 'tool_use', id: tc.id, name: tc.function.name, input: args });
          }
        }
        const hasToolUse = content.some(c => c.type === 'tool_use');
        return { content, stop_reason: hasToolUse ? 'tool_use' : 'end_turn' };
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Request failed' };
    }
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InstanceConfig {
  name: string;
  instanceUrl: string;
  authMethod: 'basic' | 'oauth';
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  toolPackage?: string;
  writeEnabled?: boolean;
  nowAssistEnabled?: boolean;
}
