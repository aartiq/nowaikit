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

// Brand colors (matches nowaitkit.com — teal/navy palette)
const teal    = chalk.hex('#00D4AA');
const navy    = chalk.hex('#0F4C81');
const bright  = chalk.hex('#33DCBB');
const dim     = chalk.hex('#4A5670');
const white   = chalk.hex('#F1F3F8');
const subtle  = chalk.hex('#7E8DA8');
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
  .version('2.4.6')
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

program.parseAsync(process.argv).catch((e: unknown) => {
  console.error(err('Error:'), e instanceof Error ? e.message : e);
  process.exit(1);
});
