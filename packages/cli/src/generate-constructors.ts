import { ImportedModules } from "./types";

export function generateConstructors(imports: string, modules: ImportedModules): string {


  return [
    imports,
    ...Object.entries(modules).flatMap(([, { interactors, matchers }]) =>
      [
        ...interactors.map(
          ({ newName }) =>
            `export const ${newName} = ${newName}Interactor.constructor(i => ({ ...i, typename: "${newName}" }))`
        ),
        ...matchers.map(
          ({ newName }) =>
            `export const ${newName} = ${newName}Matcher.constructor(m => ({ ...m, typename: "${newName}" }))`
        )
      ]
    ),
  ].join("\n");
}
