#!/usr/bin/env node
/**
 * nowaikit CLI entry point.
 *
 * Commands:
 *   nowaikit setup [--add]   — interactive setup wizard
 *   nowaikit auth login      — per-user OAuth login
 *   nowaikit auth logout     — remove stored token
 *   nowaikit auth whoami     — show current authenticated user
 *   nowaikit instances list  — list configured instances
 *   nowaikit instances remove <name>  — remove an instance
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { runSetup } from './setup.js';
import { authLogin, authLogout, authWhoami } from './auth.js';
import { listInstances, removeInstance } from './config-store.js';

const program = new Command();

program
  .name('nowaikit')
  .description('ServiceNow MCP server — setup and management CLI')
  .version('2.4.0');

// ─── setup ────────────────────────────────────────────────────────────────────
program
  .command('setup')
  .description('Interactive setup wizard — connect nowaikit to ServiceNow and your AI client')
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
      console.log(chalk.dim('No instances configured. Run `nowaikit setup` to add one.'));
      return;
    }
    console.log('');
    for (const inst of list) {
      console.log(
        `  ${chalk.bold(inst.name.padEnd(16))} ${chalk.cyan(inst.instanceUrl)}` +
        `  ${chalk.dim(inst.authMethod)} / ${chalk.dim(inst.authMode || 'service-account')}`
      );
    }
    console.log('');
  });

instances
  .command('remove <name>')
  .description('Remove a configured instance')
  .action((name: string) => {
    const removed = removeInstance(name);
    if (removed) {
      console.log(chalk.green(`Removed instance "${name}"`));
    } else {
      console.log(chalk.red(`Instance "${name}" not found`));
    }
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(chalk.red('Error:'), err instanceof Error ? err.message : err);
  process.exit(1);
});
