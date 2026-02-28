#!/usr/bin/env node
/**
 * nowaikit CLI entry point.
 *
 * Commands:
 *   nowaikit setup [--add]   — interactive setup wizard
 *   nowaikit web             — start the web dashboard in your browser
 *   nowaikit auth login      — per-user OAuth login
 *   nowaikit auth logout     — remove stored token
 *   nowaikit auth whoami     — show current authenticated user
 *   nowaikit instances list  — list configured instances
 *   nowaikit instances remove <name>  — remove an instance
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { runSetup } from './setup.js';
import { authLogin, authLogout, authWhoami } from './auth.js';
import { listInstances, removeInstance } from './config-store.js';

// Brand colors (matches nowaitkit.com — teal/navy palette)
// Terminal-adaptive: white/subtle/dim use chalk built-ins so text stays visible
// on both dark and light (bright-white) terminal backgrounds.
const teal    = chalk.hex('#00D4AA');
const navy    = chalk.hex('#0F4C81');
const bright  = chalk.hex('#00B899');
const dim     = chalk.gray;
const white   = chalk.bold;
const subtle  = chalk.dim;
const success = chalk.hex('#10B981');
const err     = chalk.hex('#E8466A');

function logoText(): string {
  return white('Now') + teal.bold('AI') + white('Kit');
}

function cliBanner(): void {
  console.log('');
  console.log(bright('  ╔╗╔') + teal('╔═╗') + bright('╦ ╦') + dim('  ') + teal('╔═╗') + bright('╦') + teal('╦╔═') + bright('╦') + teal('╔╦╗'));
  console.log(teal('  ║║║') + navy('║ ║') + teal('║║║') + dim('  ') + teal('╠═╣') + navy('║') + teal('╠╩╗') + navy('║') + teal(' ║ '));
  console.log(navy('  ╝╚╝') + teal('╚═╝') + navy('╚╩╝') + dim('  ') + navy('╩ ╩') + teal('╩') + navy('╩ ╩') + teal('╩') + navy(' ╩ ') + dim('  ') + teal('✦'));
  console.log('');
  console.log(`  ${logoText()}  ${dim('—')} ${subtle('The #1 AI App for ServiceNow')}`);
  console.log(dim('  Connect ') + teal.bold('Any AI') + dim(' to ServiceNow. Instantly.'));
  console.log('');
}

const program = new Command();

program
  .name('nowaikit')
  .description('The Most Comprehensive ServiceNow AI Toolkit')
  .version('2.5.1')
  .addHelpText('before', '')
  .addHelpText('beforeAll', () => {
    cliBanner();
    return '';
  });

// ─── setup ────────────────────────────────────────────────────────────────────
program
  .command('setup')
  .description('Interactive setup wizard — connect to ServiceNow and your AI client')
  .option('--add', 'Add another instance without overwriting existing config')
  .action(async (opts: { add?: boolean }) => {
    await runSetup({ add: opts.add });
  });

// ─── auth ─────────────────────────────────────────────────────────────────────
const auth = program.command('auth').description('Per-user authentication management');

auth
  .command('login')
  .description('Authenticate as yourself — queries run in your own ServiceNow permission context')
  .action(async () => {
    await authLogin();
  });

auth
  .command('logout [instanceUrl]')
  .description('Remove stored authentication token')
  .action((instanceUrl?: string) => {
    authLogout(instanceUrl);
  });

auth
  .command('whoami')
  .description('Show which ServiceNow user is currently authenticated')
  .action(() => {
    authWhoami();
  });

// ─── instances ────────────────────────────────────────────────────────────────
const instances = program.command('instances').description('Manage configured ServiceNow instances');

instances
  .command('list')
  .description('List all configured instances')
  .action(() => {
    const list = listInstances();
    if (list.length === 0) {
      console.log('');
      console.log(dim('  No instances configured. Run ') + teal('nowaikit setup') + dim(' to add one.'));
      console.log('');
      return;
    }
    console.log('');
    console.log(dim('  ' + '─'.repeat(60)));
    console.log(`  ${dim('NAME'.padEnd(16))} ${dim('URL'.padEnd(36))} ${dim('AUTH')}`);
    console.log(dim('  ' + '─'.repeat(60)));
    for (const inst of list) {
      const envBadge = inst.environment
        ? (inst.environment === 'production'  ? err(' PROD ')
          : inst.environment === 'development' ? success(' DEV  ')
          : inst.environment === 'test'        ? chalk.hex('#FF6B35')(' TEST ')
          : inst.environment === 'staging'     ? navy(' STG  ')
          : dim(' PDI  '))
        : '';
      console.log(
        `  ${teal(inst.name.padEnd(16))} ${bright(inst.instanceUrl.padEnd(36))} ${dim(inst.authMethod)}${envBadge ? ' ' + envBadge : ''}`
      );
      if (inst.group) {
        console.log(`  ${' '.repeat(16)} ${dim('group: ' + inst.group)}`);
      }
    }
    console.log(dim('  ' + '─'.repeat(60)));
    console.log('');
  });

instances
  .command('remove <name>')
  .description('Remove a configured instance')
  .action((name: string) => {
    const removed = removeInstance(name);
    if (removed) {
      console.log(`  ${success('✓')} ${white(`Removed instance "${name}"`)}`);
    } else {
      console.log(`  ${err('✗')} ${white(`Instance "${name}" not found`)}`);
    }
  });

// ─── web ──────────────────────────────────────────────────────────────────────
program
  .command('web')
  .description('Start the NowAIKit web dashboard in your browser')
  .option('-p, --port <port>', 'Port to listen on', '4175')
  .option('--host <host>', 'Host to bind to (use 0.0.0.0 for network)', '127.0.0.1')
  .option('--no-open', 'Do not auto-open browser')
  .action((opts: { port: string; host: string; open: boolean }) => {
    // Locate serve.js relative to this CLI file (dist/cli/index.js -> ../../desktop/serve.js)
    const cliDir = path.dirname(fileURLToPath(import.meta.url));
    const pkgRoot = path.resolve(cliDir, '..', '..');
    const serveJs = path.join(pkgRoot, 'desktop', 'serve.cjs');
    const staticDir = path.join(pkgRoot, 'desktop', 'renderer', 'dist');

    if (!existsSync(serveJs)) {
      console.log('');
      console.log(err('  Web UI server not found.'));
      console.log(dim('  If you installed via npm, make sure you have the latest version:'));
      console.log(teal('    npm install -g nowaikit@latest'));
      console.log('');
      process.exit(1);
    }

    if (!existsSync(staticDir)) {
      console.log('');
      console.log(err('  Web UI assets not found.'));
      console.log(dim('  The web UI may not have been built. If running from source:'));
      console.log(teal('    cd desktop && npm install && npm run build:web'));
      console.log('');
      process.exit(1);
    }

    cliBanner();
    console.log(dim('  Starting web dashboard…'));
    console.log('');

    const child = spawn('node', [serveJs], {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: opts.port,
        HOST: opts.host,
      },
    });

    // Auto-open browser after a short delay
    if (opts.open) {
      setTimeout(() => {
        const url = `http://localhost:${opts.port}`;
        try {
          if (process.platform === 'darwin') execSync(`open ${url}`, { stdio: 'ignore' });
          else if (process.platform === 'win32') execSync(`start ${url}`, { stdio: 'ignore' });
          else execSync(`xdg-open ${url}`, { stdio: 'ignore' });
        } catch {
          // Browser open failed silently — user can open manually
        }
      }, 1000);
    }

    child.on('exit', (code) => process.exit(code ?? 0));
  });

program.parseAsync(process.argv).catch((e: unknown) => {
  console.error(err('Error:'), e instanceof Error ? e.message : e);
  process.exit(1);
});
