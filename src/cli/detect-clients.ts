/**
 * Auto-detect installed AI clients and their MCP config paths.
 * Checks app binaries and known config file locations per platform.
 */
import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

export type WriteMethod = 'json-mcpServers' | 'json-servers' | 'command' | 'env' | 'manual';

export interface DetectedClient {
  id: string;
  name: string;
  detected: boolean;
  configPath: string;
  /** JSON key inside the config that holds the server map */
  configKey: string;
  /** How the wizard writes the entry */
  writeMethod: WriteMethod;
  requiresRestart: boolean;
  /** Extra note shown to the user after writing */
  note?: string;
}

function which(bin: string): boolean {
  try {
    // Use 'where' on Windows, 'which' on Unix
    const cmd = process.platform === 'win32' ? `where ${bin}` : `which ${bin}`;
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function appExists(macPath: string, winExe: string, linuxBin: string): boolean {
  const p = process.platform;
  if (p === 'darwin') return existsSync(macPath);
  if (p === 'win32') {
    const localAppData = process.env['LOCALAPPDATA'] || '';
    return existsSync(join(localAppData, winExe));
  }
  return which(linuxBin);
}

/**
 * VS Code's GLOBAL (user-profile) MCP config, which applies across every workspace — unlike the
 * project-level .vscode/mcp.json. Path is platform-specific:
 *   macOS   ~/Library/Application Support/Code/User/mcp.json
 *   Windows %APPDATA%\Code\User\mcp.json
 *   Linux   ~/.config/Code/User/mcp.json
 */
function vscodeUserConfigPath(): string {
  const p = process.platform;
  if (p === 'darwin') return join(homedir(), 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
  if (p === 'win32') return join(process.env['APPDATA'] || join(homedir(), 'AppData', 'Roaming'), 'Code', 'User', 'mcp.json');
  return join(homedir(), '.config', 'Code', 'User', 'mcp.json');
}

/** VS Code User directory (holds extension globalStorage), platform-specific. */
function vscodeUserDir(): string {
  const p = process.platform;
  if (p === 'darwin') return join(homedir(), 'Library', 'Application Support', 'Code', 'User');
  if (p === 'win32') return join(process.env['APPDATA'] || join(homedir(), 'AppData', 'Roaming'), 'Code', 'User');
  return join(homedir(), '.config', 'Code', 'User');
}

/** Cline stores MCP config in its VS Code extension globalStorage (uses the standard mcpServers key). */
function clineConfigPath(): string {
  return join(vscodeUserDir(), 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
}

/**
 * Robust Claude Desktop detection. The config file only appears once you've added an MCP server,
 * so a fresh install shows nothing there. Check the config FOLDER (created on first launch), and on
 * Windows the several places Claude Desktop actually installs, including the Squirrel versioned dir.
 */
function claudeDesktopDetected(configPath: string): boolean {
  const p = process.platform;
  if (existsSync(configPath) || existsSync(dirname(configPath))) return true;
  if (p === 'darwin') return existsSync('/Applications/Claude.app');
  if (p === 'win32') {
    const lad = process.env['LOCALAPPDATA'] || '';
    const candidates = [
      join(lad, 'AnthropicClaude', 'claude.exe'),
      join(lad, 'Programs', 'claude', 'Claude.exe'),
      join(lad, 'Programs', 'AnthropicClaude', 'claude.exe'),
    ];
    if (candidates.some(c => c && existsSync(c))) return true;
    // Squirrel installs the exe under %LOCALAPPDATA%\AnthropicClaude\app-<version>\
    try {
      const base = join(lad, 'AnthropicClaude');
      if (existsSync(base) && readdirSync(base).some(d => /^app-/i.test(d))) return true;
    } catch { /* ignore */ }
    return false;
  }
  return existsSync(join(homedir(), '.config', 'Claude'));
}

/**
 * Microsoft Store / MSIX builds of Claude Desktop run with AppData virtualization:
 * they read their config from a per-package sandbox
 * (`%LOCALAPPDATA%\Packages\<AnthropicClaude…>\LocalCache\Roaming\Claude\`), NOT the
 * normal `%APPDATA%\Roaming\Claude\`. Writing to the plain path is silently ignored
 * ("No servers added"). Return the packaged config path when that install is present.
 */
function storeClaudeConfigPath(): string | null {
  if (process.platform !== 'win32') return null;
  const lad = process.env['LOCALAPPDATA'] || '';
  const packages = join(lad, 'Packages');
  if (!lad || !existsSync(packages)) return null;
  try {
    const dirs = readdirSync(packages);
    // Prefer the real package family name, fall back to any Claude package.
    const match = dirs.find(d => /^AnthropicClaude/i.test(d)) || dirs.find(d => /claude/i.test(d));
    if (!match) return null;
    const claudeDir = join(packages, match, 'LocalCache', 'Roaming', 'Claude');
    // Use it if the package's Claude data folder exists (created on first launch).
    if (existsSync(claudeDir) || existsSync(dirname(claudeDir))) {
      return join(claudeDir, 'claude_desktop_config.json');
    }
  } catch { /* ignore */ }
  return null;
}

export function detectClients(): DetectedClient[] {
  const home = homedir();
  const p = process.platform;
  const appData = process.env['APPDATA'] || join(home, 'AppData', 'Roaming');
  // On Windows, a Store/MSIX Claude reads from a sandboxed Packages path; prefer it.
  const claudeDesktopConfig =
    p === 'win32'
      ? storeClaudeConfigPath() || join(appData, 'Claude', 'claude_desktop_config.json')
      : p === 'darwin'
      ? join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
      : join(home, '.config', 'Claude', 'claude_desktop_config.json');

  const clients: DetectedClient[] = [
    {
      id: 'claude-desktop',
      name: 'Claude Desktop',
      detected: false,
      configPath: claudeDesktopConfig,
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: true,
      note: 'Fully quit Claude Desktop (on Windows: right-click the tray icon → Quit) and reopen to activate.',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      detected: false,
      // Cursor reads a global ~/.cursor/mcp.json on every platform (Windows too:
      // C:\Users\<user>\.cursor\mcp.json), NOT %APPDATA%\Cursor.
      configPath: join(home, '.cursor', 'mcp.json'),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: true,
      note: 'Reload Cursor window (Cmd/Ctrl+Shift+P → Reload Window) to activate.',
    },
    {
      id: 'vscode',
      name: 'VS Code (GitHub Copilot)',
      detected: false,
      // Global user config → works in every workspace (was project-only .vscode/mcp.json, which
      // depended on where setup was run). Cross-platform via vscodeUserConfigPath().
      configPath: vscodeUserConfigPath(),
      configKey: 'servers',
      writeMethod: 'json-servers',
      requiresRestart: false,
      note: 'Written to your global VS Code MCP config (all workspaces). A project-level .vscode/mcp.json also works. Needs VS Code 1.102+ with MCP enabled.',
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      detected: false,
      // Windsurf reads ~/.codeium/windsurf/mcp_config.json on every platform
      // (Windows too: C:\Users\<user>\.codeium\windsurf\), NOT %APPDATA%\Codeium.
      configPath: join(home, '.codeium', 'windsurf', 'mcp_config.json'),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: true,
      note: 'Restart Windsurf to activate.',
    },
    {
      id: 'continue',
      name: 'Continue.dev',
      detected: false,
      configPath: join(home, '.continue', 'config.json'),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: false,
      note: 'Continue.dev will pick up the change automatically.',
    },
    {
      id: 'antigravity',
      name: 'Antigravity (Google)',
      detected: false,
      // Antigravity reads ~/.gemini/antigravity/mcp_config.json on every platform (standard format).
      configPath: join(home, '.gemini', 'antigravity', 'mcp_config.json'),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: true,
      note: 'Restart Antigravity (or Manage MCP Servers → reload) to activate.',
    },
    {
      id: 'cline',
      name: 'Cline (VS Code)',
      detected: false,
      configPath: clineConfigPath(),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: false,
      note: 'Cline picks up the change automatically. (VS Code Insiders/VSCodium use a different folder.)',
    },
    {
      id: 'gemini-cli',
      name: 'Gemini CLI',
      detected: false,
      // Global settings ~/.gemini/settings.json (mcpServers). Project .gemini/settings.json also works.
      configPath: join(home, '.gemini', 'settings.json'),
      configKey: 'mcpServers',
      writeMethod: 'json-mcpServers',
      requiresRestart: true,
      note: 'Restart the Gemini CLI session to load the server.',
    },
    {
      id: 'claude-code',
      name: 'Claude Code (CLI)',
      detected: false,
      configPath: '',
      configKey: '',
      writeMethod: 'command',
      requiresRestart: false,
      note: 'The `claude mcp add` command will be run automatically.',
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT Desktop (manual)',
      detected: false,
      configPath: '',
      configKey: '',
      writeMethod: 'manual',
      requiresRestart: true,
      note: 'ChatGPT has no config file — MCP is added in its own Settings → Connectors UI. The setup will print the STDIO details to paste.',
    },
    {
      id: 'dotenv',
      name: 'Generate .env file only',
      detected: true,
      configPath: join(process.cwd(), '.env'),
      configKey: '',
      writeMethod: 'env',
      requiresRestart: false,
      note: 'Set SERVICENOW_INSTANCE_URL and credentials in the generated .env file.',
    },
  ];

  return clients.map(c => {
    if (c.id === 'claude-desktop') {
      return { ...c, detected: claudeDesktopDetected(c.configPath) };
    }
    if (c.id === 'cursor') {
      return {
        ...c,
        detected:
          existsSync(c.configPath) ||
          appExists(
            '/Applications/Cursor.app',
            join('Programs', 'cursor', 'Cursor.exe'),
            'cursor'
          ),
      };
    }
    if (c.id === 'vscode') {
      return {
        ...c,
        detected: appExists(
          '/Applications/Visual Studio Code.app',
          join('Programs', 'Microsoft VS Code', 'Code.exe'),
          'code'
        ),
      };
    }
    if (c.id === 'windsurf') {
      return {
        ...c,
        detected:
          existsSync(c.configPath) ||
          appExists('/Applications/Windsurf.app', join('Programs', 'windsurf', 'Windsurf.exe'), 'windsurf'),
      };
    }
    if (c.id === 'continue') {
      return { ...c, detected: existsSync(c.configPath) };
    }
    if (c.id === 'antigravity') {
      return {
        ...c,
        detected:
          existsSync(c.configPath) || existsSync(dirname(c.configPath)) ||
          appExists('/Applications/Antigravity.app', join('Programs', 'Antigravity', 'Antigravity.exe'), 'antigravity'),
      };
    }
    if (c.id === 'cline') {
      // Detect via the extension's globalStorage folder (created once Cline runs).
      return { ...c, detected: existsSync(c.configPath) || existsSync(dirname(c.configPath)) };
    }
    if (c.id === 'gemini-cli') {
      return { ...c, detected: existsSync(c.configPath) || existsSync(dirname(c.configPath)) || which('gemini') };
    }
    if (c.id === 'claude-code') {
      return { ...c, detected: which('claude') };
    }
    if (c.id === 'chatgpt') {
      return { ...c, detected: appExists('/Applications/ChatGPT.app', join('Programs', 'ChatGPT', 'ChatGPT.exe'), 'chatgpt') };
    }
    return c;
  });
}
