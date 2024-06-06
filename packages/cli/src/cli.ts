import { Operation, call} from 'effection';
import { readFile, writeFile } from 'fs/promises';
import yargs from 'yargs';
import { generateImports } from './generate-imports';
import { Config } from './types';
import { importInteractors } from './import-interactors';
import { generateConstructors } from './generate-constructors';

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

    let defaultConfig: Config = {
      modules: []
    }

    let config: Config = defaultConfig;
    // try {
    //   config = yield* call(import(args.config as string))
    // } catch (error) {
    //   console.error(`Error loading config file: ${String(error.message)}`);
    //   console.error(`Using default config: ${JSON.stringify(defaultConfig)}`);
    // }
    let outDir = args.outDir;

    let modulesList = new Set([
      // NOTE: Include core by default
      '@interactors/core',
      '@interactors/html',
      ...config.modules
    ])

    let imports: { [moduleName: string]: Record<string, unknown> } = {}

    for (let moduleName of modulesList) {
      imports[moduleName] = (yield* call(import(moduleName))) as Record<string, unknown>;
    }

    let templatePath = new URL("../src/templates/agent.ts.template", import.meta.url).pathname;
    
    let agentTemplate = yield* call(readFile(templatePath, 'utf8'));

    let importedModules = importInteractors(imports, config);

    let importCode = generateImports(importedModules);
    
    console.dir({ importedModules, importCode }, { depth: 5});

    let constructorsCode = generateConstructors(importCode, importedModules);

    yield* call(writeFile(`${outDir}/agent.ts`, [importCode, agentTemplate].join('\n')));
    yield* call(writeFile(`${outDir}/constructors.ts`, constructorsCode));
  }
}
