import { ChildProcess, spawn } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import type { InstanceConfig } from './index';

interface ServerStatus {
  running: boolean;
  instance?: string;
  pid?: number;
  startedAt?: string;
  toolCount?: number;
}

export class ServerManager {
  private process: ChildProcess | null = null;
  private status: ServerStatus = { running: false };
  private tools: Array<{ name: string; description: string }> = [];

  /**
   * Resolve the path to the MCP server entry point.
   * In development: ../dist/server.js (parent nowaikit project)
   * In packaged app: resources/server/server.js
   */
  private getServerPath(): string {
    const resourcePath = join(process.resourcesPath || '', 'server', 'server.js');
    if (existsSync(resourcePath)) return resourcePath;
    return join(__dirname, '..', '..', 'dist', 'server.js');
  }

  /**
   * Build environment variables for the MCP server process.
   */
  private buildEnv(instance: InstanceConfig): Record<string, string> {
    const env: Record<string, string> = {
      SERVICENOW_INSTANCE_URL: instance.instanceUrl,
      SERVICENOW_AUTH_METHOD: instance.authMethod,
      MCP_TOOL_PACKAGE: instance.toolPackage || 'full',
      WRITE_ENABLED: instance.writeEnabled ? 'true' : 'false',
      NOW_ASSIST_ENABLED: instance.nowAssistEnabled ? 'true' : 'false',
    };

    if (instance.authMethod === 'basic') {
      env.SERVICENOW_BASIC_USERNAME = instance.username || '';
      env.SERVICENOW_BASIC_PASSWORD = instance.password || '';
    } else {
      env.SERVICENOW_OAUTH_CLIENT_ID = instance.clientId || '';
      env.SERVICENOW_OAUTH_CLIENT_SECRET = instance.clientSecret || '';
      env.SERVICENOW_OAUTH_USERNAME = instance.username || '';
      env.SERVICENOW_OAUTH_PASSWORD = instance.password || '';
    }

    return env;
  }

  /**
   * Start the MCP server as a child process.
   */
  async start(instance: InstanceConfig): Promise<{ success: boolean; error?: string }> {
    if (this.process) {
      this.stopAll();
    }

    const serverPath = this.getServerPath();
    if (!existsSync(serverPath)) {
      return { success: false, error: `Server not found at ${serverPath}. Run "npm run build" in the nowaikit root directory.` };
    }

    try {
      const env = { ...process.env, ...this.buildEnv(instance) };

      this.process = spawn('node', [serverPath], {
        env,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      });

      this.status = {
        running: true,
        instance: instance.name,
        pid: this.process.pid,
        startedAt: new Date().toISOString(),
      };

      this.process.on('exit', (code) => {
        console.log(`MCP server exited with code ${code}`);
        this.status = { running: false };
        this.process = null;
      });

      this.process.stderr?.on('data', (data) => {
        console.error(`MCP server stderr: ${data}`);
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /**
   * Stop all running server processes.
   */
  stopAll(): void {
    if (this.process) {
      this.process.kill('SIGTERM');
      this.process = null;
      this.status = { running: false };
    }
  }

  /**
   * Get current server status.
   */
  getStatus(): ServerStatus {
    return { ...this.status };
  }

  /**
   * Test connection to a ServiceNow instance.
   */
  async testConnection(instance: InstanceConfig): Promise<{ success: boolean; error?: string; info?: Record<string, unknown> }> {
    try {
      const url = `${instance.instanceUrl}/api/now/table/sys_properties?sysparm_query=name=instance_name&sysparm_limit=1&sysparm_fields=value`;

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (instance.authMethod === 'basic') {
        const creds = Buffer.from(`${instance.username}:${instance.password}`).toString('base64');
        headers['Authorization'] = `Basic ${creds}`;
      }

      const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });

      if (response.status === 401) {
        return { success: false, error: 'Authentication failed. Check your credentials.' };
      }
      if (response.status === 403) {
        return { success: false, error: 'Access denied. Check user permissions.' };
      }
      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }

      const data = await response.json() as { result?: Array<{ value?: string }> };
      const instanceName = data?.result?.[0]?.value || 'Unknown';

      return { success: true, info: { instanceName, url: instance.instanceUrl } };
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        return { success: false, error: 'Connection timed out. Check the instance URL.' };
      }
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  /**
   * List available tools (reads from the compiled tool definitions).
   */
  async listTools(): Promise<Array<{ name: string; description: string }>> {
    // Return cached tools if available
    if (this.tools.length > 0) return this.tools;

    try {
      // Dynamically load tool definitions from the server module
      const serverPath = this.getServerPath();
      const toolsModulePath = serverPath.replace('server.js', join('tools', 'index.js'));

      if (existsSync(toolsModulePath)) {
        // We can't easily import ESM from CJS, so return a static list
        // The actual tool list is loaded when the server starts
        return [{ name: 'loading...', description: 'Start the server to see all tools' }];
      }
    } catch {
      // Fallback
    }

    return [{ name: 'loading...', description: 'Start the server to see all tools' }];
  }

  /**
   * Execute a tool via the running server.
   */
  async executeTool(name: string, args: Record<string, unknown>): Promise<{ success: boolean; result?: unknown; error?: string }> {
    if (!this.process || !this.status.running) {
      return { success: false, error: 'Server is not running. Start the server first.' };
    }

    // Send JSON-RPC request to the MCP server via stdin
    const id = Date.now();
    const request = JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: { name, arguments: args },
    });

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Tool execution timed out (30s)' });
      }, 30000);

      const onData = (data: Buffer) => {
        try {
          const lines = data.toString().split('\n').filter(Boolean);
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === id) {
              clearTimeout(timeout);
              this.process?.stdout?.off('data', onData);
              if (response.error) {
                resolve({ success: false, error: response.error.message });
              } else {
                resolve({ success: true, result: response.result });
              }
              return;
            }
          }
        } catch {
          // Partial JSON, wait for more data
        }
      };

      this.process?.stdout?.on('data', onData);
      this.process?.stdin?.write(request + '\n');
    });
  }
}
