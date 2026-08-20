import { describe, it, expect, afterEach } from 'vitest';
import { join } from 'path';
import { detectClients } from '../../src/cli/detect-clients.js';

/**
 * Verifies the per-OS MCP config paths for each client without needing Windows/Linux hardware,
 * by mocking process.platform. (path.join uses the host separator, so we assert on segments.)
 */
const original = process.platform;
function setPlatform(p: NodeJS.Platform) { Object.defineProperty(process, 'platform', { value: p, configurable: true }); }
afterEach(() => setPlatform(original));

const pathOf = (id: string) => detectClients().find((c) => c.id === id)!.configPath;

describe('cross-platform MCP config paths', () => {
  it('macOS: VS Code global, Cline, Antigravity', () => {
    setPlatform('darwin');
    expect(pathOf('vscode')).toContain(join('Library', 'Application Support', 'Code', 'User', 'mcp.json'));
    expect(pathOf('cline')).toContain(join('globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json'));
    expect(pathOf('antigravity')).toContain(join('.gemini', 'antigravity', 'mcp_config.json'));
    expect(pathOf('gemini-cli')).toContain(join('.gemini', 'settings.json'));
  });

  it('Windows: VS Code + Cline live under the Code/User profile (APPDATA)', () => {
    setPlatform('win32');
    process.env.APPDATA = process.env.APPDATA || 'C:\\Users\\test\\AppData\\Roaming';
    expect(pathOf('vscode')).toContain(join('Code', 'User', 'mcp.json'));
    expect(pathOf('vscode')).not.toContain('Application Support');
    expect(pathOf('cline')).toContain(join('Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev'));
  });

  it('Linux: VS Code under ~/.config/Code/User', () => {
    setPlatform('linux');
    expect(pathOf('vscode')).toContain(join('.config', 'Code', 'User', 'mcp.json'));
  });

  it('Cursor + Antigravity are home-relative on every platform', () => {
    for (const p of ['darwin', 'win32', 'linux'] as NodeJS.Platform[]) {
      setPlatform(p);
      expect(pathOf('cursor')).toContain(join('.cursor', 'mcp.json'));
      expect(pathOf('antigravity')).toContain(join('.gemini', 'antigravity', 'mcp_config.json'));
    }
  });
});
