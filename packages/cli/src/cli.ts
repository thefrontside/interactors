import { Operation, call} from 'effection';
import { readFile, writeFile } from 'fs/promises';
import yargs from 'yargs';
import { generateImports } from './generate';
import { Config } from './types';

export function cli(argv: readonly string[]) {
  return function*(): Operation<void> {
    let args = yargs
    .scriptName('interactors')
    .option('config', {
      alias: 'c',
      global: true,
      default: './interactors.config.js',
      desc: 'the config file to use for interactors',
    })
    .option('outDir', {
      alias: 'o',
      global: true,
      default: './build',
      desc: 'the output directory for generated files',
    })
    .command('build', 'build agent.ts for a test environment')
    .demandCommand()
    .help()
    .parse(argv)

    let config: Config = yield* call(import(args.config as string));
    let outDir = config.outDir ?? args.outDir as string;

    let modules = new Set([
      // NOTE: Include core by default
      '@interactors/core',
      ...config.modules
    ])

    let imports: { [moduleName: string]: Record<string, unknown> } = {}

    for (let moduleName of modules) {
      imports[moduleName] = (yield* call(import(moduleName))) as Record<string, unknown>;
    }

    let agentTemplate = yield* call(readFile('./templates/agent.ts', 'utf8'));

    let importCode = generateImports(imports, config);

    yield* call(writeFile(`${outDir}/agent.ts`, [importCode, agentTemplate].join('\n')));
  }
}
