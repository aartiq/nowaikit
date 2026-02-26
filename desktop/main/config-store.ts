import { app } from 'electron';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { InstanceConfig } from './index';

interface AppConfig {
  instances: InstanceConfig[];
  activeInstance?: string;
  theme: 'light' | 'dark' | 'system';
  telemetry: boolean;
  autoUpdate: boolean;
  windowBounds?: { width: number; height: number; x?: number; y?: number };
}

const DEFAULT_CONFIG: AppConfig = {
  instances: [],
  theme: 'system',
  telemetry: false,
  autoUpdate: true,
};

export class ConfigStore {
  private configPath: string;
  private auditPath: string;
  private config: AppConfig;

  constructor() {
    const userDataPath = app?.getPath?.('userData') || join(process.env.HOME || process.env.USERPROFILE || '.', '.config', 'nowaikit');
    if (!existsSync(userDataPath)) mkdirSync(userDataPath, { recursive: true });

    this.configPath = join(userDataPath, 'config.json');
    this.auditPath = join(userDataPath, 'audit.jsonl');
    this.config = this.load();
  }

  private load(): AppConfig {
    try {
      if (existsSync(this.configPath)) {
        const raw = readFileSync(this.configPath, 'utf8');
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      }
    } catch {
      // Corrupted config, reset
    }
    return { ...DEFAULT_CONFIG };
  }

  private save(): void {
    writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), 'utf8');
  }

  get(key: string): unknown {
    return (this.config as Record<string, unknown>)[key];
  }

  set(key: string, value: unknown): void {
    (this.config as Record<string, unknown>)[key] = value;
    this.save();
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  // ── Instances ──

  getInstances(): InstanceConfig[] {
    return [...this.config.instances];
  }

  addInstance(instance: InstanceConfig): { success: boolean; error?: string } {
    const existing = this.config.instances.findIndex(i => i.name === instance.name);
    if (existing >= 0) {
      this.config.instances[existing] = instance;
    } else {
      this.config.instances.push(instance);
    }
    if (!this.config.activeInstance) {
      this.config.activeInstance = instance.name;
    }
    this.save();
    return { success: true };
  }

  removeInstance(name: string): { success: boolean; error?: string } {
    const idx = this.config.instances.findIndex(i => i.name === name);
    if (idx < 0) return { success: false, error: `Instance "${name}" not found` };
    this.config.instances.splice(idx, 1);
    if (this.config.activeInstance === name) {
      this.config.activeInstance = this.config.instances[0]?.name;
    }
    this.save();
    return { success: true };
  }

  // ── Audit Log ──

  getAuditLogs(limit: number): Array<Record<string, unknown>> {
    try {
      if (!existsSync(this.auditPath)) return [];
      const lines = readFileSync(this.auditPath, 'utf8').trim().split('\n').filter(Boolean);
      return lines
        .slice(-limit)
        .reverse()
        .map(line => {
          try { return JSON.parse(line); }
          catch { return { raw: line }; }
        });
    } catch {
      return [];
    }
  }
}
