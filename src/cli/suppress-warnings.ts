/**
 * Silence Node's experimental warnings in the CLI. A transitive dep (ora -> cli-spinners) imports
 * a JSON module (`import ... with { type: 'json' }`), which makes Node print an ExperimentalWarning
 * on every run. That noise is not actionable for a CLI user, so we drop ExperimentalWarning while
 * passing every other warning through untouched.
 *
 * This module has no imports of its own and MUST be imported before anything that pulls in ora, so
 * the override is installed before the JSON-importing dependency evaluates.
 */
const originalEmitWarning = process.emitWarning.bind(process);

(process as unknown as { emitWarning: (...a: unknown[]) => void }).emitWarning = (
  warning: unknown,
  ...rest: unknown[]
): void => {
  const asErr = warning as { name?: string; message?: string } | undefined;
  const name = typeof warning === 'object' && warning ? asErr?.name : (rest[0] as string | undefined);
  const message = typeof warning === 'string' ? warning : asErr?.message;
  if (name === 'ExperimentalWarning' || (message && /JSON modules|Importing JSON/i.test(message))) return;
  (originalEmitWarning as (...a: unknown[]) => void)(warning, ...rest);
};
