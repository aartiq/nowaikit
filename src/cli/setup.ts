/**
 * Interactive setup wizard — `nowaikit setup`
 *
 * Walks the user through:
 *   1. ServiceNow instance URL
 *   2. Auth method (Basic / OAuth)
 *   3. Credentials
 *   4. Connection test
 *   5. Permission tier / tool package selection
 *   6. AI client selection + config writing
 */
import { input, password, select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import { addInstance, loadConfig } from './config-store.js';
import { detectClients } from './detect-clients.js';
import { writeClientConfig } from './writers/index.js';
import type { InstanceConfig } from './config-store.js';

const TOOL_PACKAGES = [
  { value: 'full', name: 'full — all 284+ tools' },
  { value: 'service_desk', name: 'service_desk — help desk agents' },
  { value: 'change_coordinator', name: 'change_coordinator — change managers' },
  { value: 'knowledge_author', name: 'knowledge_author — KB writers' },
  { value: 'catalog_builder', name: 'catalog_builder — catalog admins' },
  { value: 'system_administrator', name: 'system_administrator — SysAdmins' },
  { value: 'platform_developer', name: 'platform_developer — developers' },
  { value: 'itom_engineer', name: 'itom_engineer — IT Ops / monitoring' },
  { value: 'agile_manager', name: 'agile_manager — Scrum / SAFe teams' },
  { value: 'ai_developer', name: 'ai_developer — Now Assist / AI builders' },
];

/** Returns true if `cmd` is resolvable on PATH. */
function isCommandAvailable(cmd: string): boolean {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${which} ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures the `nowaikit` binary is available on PATH by running `npm link`
 * in the package root. Skips silently if it's already linked.
 */
async function ensureGlobalCommand(): Promise<void> {
  if (isCommandAvailable('nowaikit')) return; // already on PATH, nothing to do

  const spinner = ora('  Making `nowaikit` available as a global command…').start();

  // dist/cli/setup.js → dist/cli/ → dist/ → <package root>
  const pkgRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..', '..');

  try {
    execSync('npm link', { cwd: pkgRoot, stdio: 'pipe' });
    spinner.succeed(chalk.green('  ✓ `nowaikit` is now available as a global command'));
  } catch {
    // npm link failed (common cause: /usr/local/bin needs sudo).
    // Try again honoring the user's configured npm prefix, which is usually
    // writable without sudo when using nvm, volta, fnm, or a local prefix.
    try {
      const prefix = execSync('npm config get prefix', { encoding: 'utf8', stdio: 'pipe' }).trim();
      execSync('npm link', {
        cwd: pkgRoot,
        stdio: 'pipe',
        env: { ...process.env, npm_config_prefix: prefix },
      });
      spinner.succeed(chalk.green('  ✓ `nowaikit` linked via npm prefix'));
    } catch {
      spinner.warn(chalk.yellow('  Could not link globally — permission denied'));
      console.log('');
      console.log(chalk.dim('  Fix options (choose one):'));
      console.log(chalk.cyan(`    sudo npm link`)                          + chalk.dim('  # if using system Node'));
      console.log(chalk.cyan(`    npm install -g now-ai-kit`)              + chalk.dim('  # install from npm registry'));
      console.log(chalk.cyan(`    npx nowaikit instances list`)            + chalk.dim('  # use npx instead of global command'));
    }
  }
}

function banner(): void {
  console.log('');
  console.log(chalk.bold.cyan('  nowaikit — ServiceNow MCP Setup Wizard'));
  console.log(chalk.dim('  ─────────────────────────────────────────────'));
  console.log('');
}

function step(n: number, total: number, title: string): void {
  console.log('');
  console.log(chalk.bold(`  Step ${n}/${total} — ${title}`));
}

async function testConnection(
  instanceUrl: string,
  authMethod: 'basic' | 'oauth',
  creds: Partial<InstanceConfig>
): Promise<{ ok: boolean; message: string }> {
  const spinner = ora('  Testing connection to ServiceNow…').start();

  try {
    const { ServiceNowClient } = await import('../servicenow/client.js');
    const client = new ServiceNowClient({
      instanceUrl,
      authMethod,
      basic: { username: creds.username, password: creds.password },
      oauth: {
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        username: creds.username,
        password: creds.password,
      },
    });

    const result = await client.queryRecords({ table: 'sys_user', limit: 1 });
    spinner.succeed(chalk.green(`  Connected — ${result.count >= 0 ? 'auth OK' : 'warning'}`));
    return { ok: true, message: 'Connection successful' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    spinner.fail(chalk.red(`  Connection failed: ${msg}`));
    return { ok: false, message: msg };
  }
}

export async function runSetup(options: { add?: boolean } = {}): Promise<void> {
  banner();

  const existing = loadConfig();
  const isFirstRun = Object.keys(existing.instances).length === 0 && !options.add;

  if (isFirstRun) {
    console.log(chalk.dim("  Let's connect your first ServiceNow instance.\n"));
  } else if (options.add) {
    console.log(chalk.dim('  Adding a new ServiceNow instance.\n'));
  }

  // ─── Step 1: Instance URL ──────────────────────────────────────────────────
  step(1, 6, 'ServiceNow Instance');

  const instanceUrl = await input({
    message: 'Instance URL (no trailing slash):',
    default: 'https://yourcompany.service-now.com',
    validate: (v: string) => {
      if (!v.startsWith('https://')) return 'Must start with https://';
      if (v.endsWith('/')) return 'Remove the trailing slash';
      return true;
    },
  });

  const instanceName = await input({
    message: 'Short name for this instance (e.g. prod, dev, acme):',
    default: 'default',
    validate: (v: string) => (/^[a-z0-9_-]+$/i.test(v) ? true : 'Letters, numbers, - and _ only'),
  });

  // ─── Step 2: Auth Method ───────────────────────────────────────────────────
  step(2, 6, 'Authentication');

  const authMethod = await select<'basic' | 'oauth'>({
    message: 'Authentication method:',
    choices: [
      { name: 'Basic (username + password) — good for dev/PDI', value: 'basic' },
      { name: 'OAuth 2.0 — recommended for production', value: 'oauth' },
    ],
  });

  const authMode = await select<'service-account' | 'per-user' | 'impersonation'>({
    message: 'Execution context (who runs the queries?):',
    choices: [
      {
        name: 'Service account — one shared account (current default)',
        value: 'service-account',
      },
      {
        name: 'Per-user — each user authenticates with their own credentials (enterprise)',
        value: 'per-user',
      },
      {
        name: 'Impersonation — service account + X-Sn-Impersonate header per user',
        value: 'impersonation',
      },
    ],
  });

  // ─── Step 3: Credentials ───────────────────────────────────────────────────
  step(3, 6, 'Credentials');

  let username: string | undefined;
  let userPassword: string | undefined;
  let clientId: string | undefined;
  let clientSecret: string | undefined;

  if (authMode === 'per-user') {
    console.log(
      chalk.dim(
        '  Per-user mode: run `nowaikit auth login` separately for each user.\n' +
        '  For now, provide a fallback service account for setup testing.'
      )
    );
  }

  if (authMethod === 'basic') {
    username = await input({ message: 'Username:' });
    userPassword = await password({ message: 'Password:', mask: '•' });
  } else {
    clientId = await input({ message: 'OAuth Client ID:' });
    clientSecret = await password({ message: 'OAuth Client Secret:', mask: '•' });
    username = await input({ message: 'Service account username:' });
    userPassword = await password({ message: 'Service account password:', mask: '•' });
  }

  // ─── Step 4: Test Connection ───────────────────────────────────────────────
  step(4, 6, 'Testing Connection');

  const { ok } = await testConnection(instanceUrl, authMethod, {
    username,
    password: userPassword,
    clientId,
    clientSecret,
  });

  if (!ok) {
    const proceed = await confirm({
      message: 'Connection failed. Save config anyway?',
      default: false,
    });
    if (!proceed) {
      console.log(chalk.yellow('\n  Setup cancelled. Fix credentials and try again.\n'));
      return;
    }
  }

  // ─── Step 5: Permissions & Role ────────────────────────────────────────────
  step(5, 6, 'Permissions & Role');

  const toolPackage = await select<string>({
    message: 'Tool package:',
    choices: TOOL_PACKAGES,
  });

  const writeEnabled = await confirm({
    message: 'Enable write operations (create/update/delete)?',
    default: false,
  });

  const instance: InstanceConfig = {
    name: instanceName.toLowerCase(),
    instanceUrl,
    authMethod,
    username,
    password: userPassword,
    clientId,
    clientSecret,
    authMode,
    writeEnabled,
    toolPackage,
    addedAt: new Date().toISOString(),
  };

  addInstance(instance);
  console.log(chalk.green(`\n  ✓ Saved instance "${instance.name}" to ~/.config/nowaikit/instances.json`));

  // ─── Step 6: AI Client Installation ────────────────────────────────────────
  step(6, 6, 'Install into AI Client(s)');

  const clients = detectClients();
  const detected = clients.filter(c => c.detected);
  const notDetected = clients.filter(c => !c.detected);

  if (detected.length === 0) {
    console.log(chalk.yellow('  No AI clients detected. Generating .env file instead.'));
    const dotenvClient = clients.find(c => c.id === 'dotenv')!;
    const result = writeClientConfig(dotenvClient, instance);
    console.log(result.success ? chalk.green(`  ✓ ${result.message}`) : chalk.red(`  ✗ ${result.message}`));
    await ensureGlobalCommand();
    printSummary(instance);
    return;
  }

  console.log(chalk.dim('  Detected clients:'));
  detected.forEach(c => console.log(chalk.dim(`    ✓ ${c.name}`)));
  if (notDetected.length > 0) {
    console.log(chalk.dim('  Not found:'));
    notDetected
      .filter(c => c.id !== 'dotenv')
      .forEach(c => console.log(chalk.dim(`    ✗ ${c.name}`)));
  }

  const chosen = await checkbox<string>({
    message: 'Install into (space to select, enter to confirm):',
    choices: detected.map(c => ({ name: c.name, value: c.id, checked: c.id !== 'dotenv' })),
  });

  if (chosen.length === 0) {
    console.log(chalk.yellow('\n  No clients selected. Nothing written.'));
    await ensureGlobalCommand();
    printSummary(instance);
    return;
  }

  console.log('');
  for (const id of chosen) {
    const client = clients.find(c => c.id === id);
    if (!client) continue;
    const result = writeClientConfig(client, instance);
    if (result.success) {
      console.log(chalk.green(`  ✓ ${client.name}: ${result.message}`));
      if (client.note) console.log(chalk.dim(`    → ${client.note}`));
    } else {
      console.log(chalk.red(`  ✗ ${client.name}: ${result.message}`));
    }
  }

  await ensureGlobalCommand();
  printSummary(instance);
}

function printSummary(instance: InstanceConfig): void {
  console.log('');
  console.log(chalk.bold.green('  Setup complete!'));
  console.log('');
  console.log(chalk.dim('  Restart your AI client to activate the new config, then try:'));
  console.log(chalk.cyan('    List my 5 most recent open incidents'));
  console.log('');
  console.log(chalk.dim('  Manage nowaikit from the terminal:'));
  console.log(`    ${chalk.cyan('nowaikit setup --add')}        Add another instance`);
  console.log(`    ${chalk.cyan('nowaikit instances list')}     Show configured instances`);
  console.log(`    ${chalk.cyan('nowaikit instances remove')}   Remove an instance`);
  if (instance.authMode === 'per-user') {
    console.log(`    ${chalk.cyan('nowaikit auth login')}         Authenticate as yourself`);
  }
  console.log('');
}
