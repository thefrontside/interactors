import { InitInteractor, MatcherConstructor } from "@interactors/core";
import { Config, ImportedModules } from "./types.ts";

export function importInteractors(modules: { [moduleName: string]: Record<string, unknown> }, config: Partial<Config> = {}): ImportedModules {
  let uniqueNames = new Map<string, string>();

  let imports: ImportedModules = {}

  for (let moduleName in modules) {
    imports[moduleName] = {
      interactors: [],
      matchers: []
    }

    let { interactors, matchers } = imports[moduleName];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return imports;
}
