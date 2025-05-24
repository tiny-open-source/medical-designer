import type { UserConfig } from './types';
import process from 'node:process';
import { cac } from 'cac';
import chalk from 'chalk';
import { scripts } from './commands';
import { allowTs } from './utils/allowTs';

/**
 * Wrap raw command to catch errors and exit process
 */
function wrapCommand(cmd: (...args: any[]) => Promise<void>): typeof cmd {
  const wrappedCommand: typeof cmd = (...args) =>
    cmd(...args).catch((err) => {
      console.error(chalk.red(err.stack));
      process.exit(1);
    });
  return wrappedCommand;
}

/**
 * Vuepress cli
 */
export function cli(defaultAppConfig: UserConfig): void {
  // allow ts files globally
  allowTs();

  // create cac instance
  const program = cac('low-code');

  // display core version and cli version
  const versionCli = require('../package.json').version;
  program.version(`low-code/cli@${versionCli}`);

  // display help message
  program.help();

  // register `dev` command
  program.command('entry', 'Start development server').action(wrapCommand(scripts(defaultAppConfig)));

  program.parse(process.argv);
}
