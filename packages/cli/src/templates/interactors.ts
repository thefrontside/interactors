import type { InteractorConstructor, Matcher } from "@interactors/core"
import { modules } from './modules'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InteractorTable: Record<string, InteractorConstructor<any, any, any, any>> = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MatcherTable: Record<string, (...args: any) => Matcher<unknown>> = {}

export const imports: { [moduleName: string]: { interactors: { name: string }[], matchers: { name: string }[] } } = {}

let uniqueNames = new Map<string, string>();

for (let moduleName in modules) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (let [name, obj] of Object.entries<any>(modules[moduleName])) {
    if (Object.prototype.toString.call(obj) === '[object Interactor]') {
      let interactorName = name;
      if (uniqueNames.has(interactorName)) {
        throw new Error(`Interactor name ${interactorName} from ${moduleName} is conflicted with named import from ${uniqueNames.get(interactorName)}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      InteractorTable[interactorName] = obj as InteractorConstructor<any, any, any, any>
      if (imports[moduleName] === undefined) {
        imports[moduleName] = { interactors: [], matchers: [] }
      }
      imports[moduleName].interactors.push({ name });
      uniqueNames.set(interactorName, moduleName);
    }
    if (Object.prototype.toString.call(obj) === '[object Matcher]') {
      let matcherName = name;
      if (uniqueNames.has(matcherName)) {
        throw new Error(`Matcher name ${matcherName} from ${moduleName} is conflicted with named import from ${uniqueNames.get(matcherName)}`);
      }
      MatcherTable[matcherName] = obj as () => Matcher<unknown>
      if (imports[moduleName] === undefined) {
        imports[moduleName] = { interactors: [], matchers: [] }
      }
      imports[moduleName].matchers.push({ name });
      uniqueNames.set(matcherName, moduleName);
    }
  }
}
