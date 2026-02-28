/**
 * Persistent config store for nowaikit CLI.
 * Stores named instance configs at ~/.config/nowaikit/instances.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface InstanceConfig {
  name: string;
  instanceUrl: string;
  authMethod: 'basic' | 'oauth';
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  authMode?: 'service-account' | 'per-user' | 'impersonation';
  writeEnabled?: boolean;
  toolPackage?: string;
  nowAssistEnabled?: boolean;
  group?: string;
  environment?: string;
  addedAt: string;
}

export interface NowaikitConfig {
  version: number;
  defaultInstance: string;
  instances: Record<string, InstanceConfig>;
}

function configDir(): string {
  return join(homedir(), '.config', 'nowaikit');
}

function configPath(): string {
  return join(configDir(), 'instances.json');
}

function ensureDir(): void {
  const dir = configDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadConfig(): NowaikitConfig {
  const path = configPath();
  if (!existsSync(path)) {
    return { version: 1, defaultInstance: '', instances: {} };
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as NowaikitConfig;
  } catch {
    return { version: 1, defaultInstance: '', instances: {} };
  }
}

export function saveConfig(config: NowaikitConfig): void {
  ensureDir();
  writeFileSync(configPath(), JSON.stringify(config, null, 2), 'utf8');
}

export function addInstance(instance: InstanceConfig): void {
  const config = loadConfig();
  config.instances[instance.name] = instance;
  if (!config.defaultInstance) {
    config.defaultInstance = instance.name;
  }
  saveConfig(config);
}

export function listInstances(): InstanceConfig[] {
  const config = loadConfig();
  return Object.values(config.instances);
}

export function getDefaultInstance(): InstanceConfig | undefined {
  const config = loadConfig();
  return config.instances[config.defaultInstance];
}

export function removeInstance(name: string): boolean {
  const config = loadConfig();
  if (!config.instances[name]) return false;
  delete config.instances[name];
  if (config.defaultInstance === name) {
    const remaining = Object.keys(config.instances);
    config.defaultInstance = remaining[0] || '';
  }
  saveConfig(config);
  return true;
}
