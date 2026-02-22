/**
 * Multi-instance manager for now-ai-kit.
 *
 * Supports connecting to multiple ServiceNow instances (e.g. dev, staging, prod,
 * or multiple customers) from a single MCP session.
 *
 * Configuration methods (in priority order):
 *   1. SN_INSTANCES_CONFIG — path to an instances.json file
 *   2. SN_INSTANCE_<NAME>_URL / SN_INSTANCE_<NAME>_AUTH env var groups
 *   3. Single-instance legacy env vars (SERVICENOW_INSTANCE_URL, etc.) → registered as "default"
 *
 * Usage:
 *   import { instanceManager } from './instances.js';
 *   const client = instanceManager.getClient();          // current instance
 *   const client = instanceManager.getClient('prod');    // specific instance
 *   instanceManager.switch('prod');                      // switch active instance
 */
import { readFileSync, existsSync } from 'fs';
import { ServiceNowClient } from './client.js';
import type { ServiceNowConfig } from './types.js';

interface InstanceEntry {
  name: string;
  url: string;
  client: ServiceNowClient;
}

class InstanceManager {
  private instances: Map<string, InstanceEntry> = new Map();
  private currentName: string = 'default';

  constructor() {
    this.loadInstances();
  }

  private loadInstances(): void {
    // 1. Try instances.json config file
    const configPath = process.env.SN_INSTANCES_CONFIG;
    if (configPath && existsSync(configPath)) {
      try {
        const raw = JSON.parse(readFileSync(configPath, 'utf8'));
        const defaultName: string = raw.default_instance || raw.default || 'default';
        for (const [name, cfg] of Object.entries(raw.instances || {})) {
          const c = cfg as any;
          this.register(name, this.buildConfig(
            c.instance_url || c.url,
            c.auth_method || c.auth || 'basic',
            c
          ));
        }
        if (this.instances.has(defaultName)) this.currentName = defaultName;
        return;
      } catch (e) {
        // fall through to env vars
      }
    }

    // 2. Try SN_INSTANCE_<NAME>_URL env var groups
    const envNames = Object.keys(process.env)
      .filter(k => /^SN_INSTANCE_[A-Z0-9_]+_URL$/.test(k))
      .map(k => k.replace(/^SN_INSTANCE_/, '').replace(/_URL$/, '').toLowerCase());

    for (const name of envNames) {
      const upper = name.toUpperCase();
      const url = process.env[`SN_INSTANCE_${upper}_URL`];
      const auth = (process.env[`SN_INSTANCE_${upper}_AUTH`] || 'basic') as 'oauth' | 'basic';
      if (!url) continue;
      this.register(name, {
        instanceUrl: url,
        authMethod: auth,
        basic: {
          username: process.env[`SN_INSTANCE_${upper}_USERNAME`],
          password: process.env[`SN_INSTANCE_${upper}_PASSWORD`],
        },
        oauth: {
          clientId: process.env[`SN_INSTANCE_${upper}_CLIENT_ID`],
          clientSecret: process.env[`SN_INSTANCE_${upper}_CLIENT_SECRET`],
          username: process.env[`SN_INSTANCE_${upper}_USERNAME`],
          password: process.env[`SN_INSTANCE_${upper}_PASSWORD`],
        },
      });
    }

    const defaultEnvName = (process.env.SN_DEFAULT_INSTANCE || '').toLowerCase();
    if (defaultEnvName && this.instances.has(defaultEnvName)) {
      this.currentName = defaultEnvName;
    }

    // 3. Legacy single-instance env vars → register as "default" if no others loaded
    const legacyUrl = process.env.SERVICENOW_INSTANCE_URL;
    if (legacyUrl && !this.instances.has('default')) {
      const auth = (process.env.SERVICENOW_AUTH_METHOD || 'basic') as 'oauth' | 'basic';
      this.register('default', {
        instanceUrl: legacyUrl,
        authMethod: auth,
        basic: {
          username: process.env.SERVICENOW_BASIC_USERNAME,
          password: process.env.SERVICENOW_BASIC_PASSWORD,
        },
        oauth: {
          clientId: process.env.SERVICENOW_CLIENT_ID,
          clientSecret: process.env.SERVICENOW_CLIENT_SECRET,
          username: process.env.SERVICENOW_USERNAME,
          password: process.env.SERVICENOW_PASSWORD,
        },
        maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
        retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '1000', 10),
        requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10),
      });
      if (this.instances.size === 1) this.currentName = 'default';
    }
  }

  private buildConfig(url: string, auth: 'oauth' | 'basic', c: any): ServiceNowConfig {
    return {
      instanceUrl: url,
      authMethod: auth,
      basic: { username: c.username, password: c.password },
      oauth: {
        clientId: c.client_id,
        clientSecret: c.client_secret,
        username: c.username,
        password: c.password,
      },
      maxRetries: c.max_retries || parseInt(process.env.MAX_RETRIES || '3', 10),
      retryDelayMs: c.retry_delay_ms || parseInt(process.env.RETRY_DELAY_MS || '1000', 10),
      requestTimeoutMs: c.request_timeout_ms || parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10),
    };
  }

  private register(name: string, config: ServiceNowConfig): void {
    this.instances.set(name, {
      name,
      url: config.instanceUrl,
      client: new ServiceNowClient(config),
    });
  }

  /** Return client for named instance (or current instance if no name given). */
  getClient(name?: string): ServiceNowClient {
    const target = name ? name.toLowerCase() : this.currentName;
    const entry = this.instances.get(target);
    if (!entry) {
      throw new Error(`Unknown instance "${target}". Available: ${this.listNames().join(', ')}`);
    }
    return entry.client;
  }

  /** Switch the active instance for the session. */
  switch(name: string): void {
    const lower = name.toLowerCase();
    if (!this.instances.has(lower)) {
      throw new Error(`Unknown instance "${name}". Available: ${this.listNames().join(', ')}`);
    }
    this.currentName = lower;
  }

  getCurrentName(): string {
    return this.currentName;
  }

  getCurrentUrl(): string {
    return this.instances.get(this.currentName)?.url || '';
  }

  listNames(): string[] {
    return Array.from(this.instances.keys());
  }

  listAll(): Array<{ name: string; url: string; active: boolean }> {
    return Array.from(this.instances.values()).map(e => ({
      name: e.name,
      url: e.url,
      active: e.name === this.currentName,
    }));
  }
}

export const instanceManager = new InstanceManager();
