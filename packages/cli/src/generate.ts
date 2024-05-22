import { InitInteractor, MatcherConstructor } from "@interactors/core";
import { Config } from "./types.ts";

export function generateImports(modules: { [moduleName: string]: Record<string, unknown> }, config: Partial<Config> = {}): string {
  let uniqueNames = new Map<string, string>();

  let imports: Record<string, {
    interactors: { oldName: string, newName: string }[]
    matchers: { oldName: string, newName: string }[]
  }> = {}

  for (let moduleName in modules) {
    imports[moduleName] = {
      interactors: [],
      matchers: []
    }

    let { interactors, matchers } = imports[moduleName];

    for (let [name, obj] of Object.entries<any>(modules[moduleName])) {
      if (obj instanceof InitInteractor) {
        let interactorName = config.overrides?.(moduleName, name) ?? name;
        if (uniqueNames.has(interactorName)) {
          throw new Error(`Interactor name ${interactorName} from ${moduleName} is conflicted with named import from ${uniqueNames.get(interactorName)}`);
        }
        interactors.push({ oldName: name, newName: interactorName });
        uniqueNames.set(interactorName, moduleName);
      }
      if (obj instanceof MatcherConstructor) {
        let matcherName = config.overrides?.(moduleName, name) ?? name;
        if (uniqueNames.has(matcherName)) {
          throw new Error(`Matcher name ${matcherName} from ${moduleName} is conflicted with named import from ${uniqueNames.get(matcherName)}`);
        }
        matchers.push({ oldName: name, newName: matcherName });
        uniqueNames.set(matcherName, moduleName);
      }
    }
  }

  return [
    ...Object.entries(imports).map(
      ([moduleName, { interactors, matchers }]) => `import { ${
        [...interactors, ...matchers].map(
          ({ oldName, newName }) => oldName === newName ? newName : `${oldName} as ${newName}`
        ).join(', ')
      } } from '${moduleName}'`
    ),
    `const InteractorTable = {${
      Object.values(imports).flatMap(({ interactors }) => interactors.map(({ newName }) => newName)).join(', ')
    }}`,
    `const MatcherTable = {${
      Object.values(imports).flatMap(({ matchers }) => matchers.map(({ newName }) => newName)).join(', ')
    }}`,
  ].join('\n')
}
