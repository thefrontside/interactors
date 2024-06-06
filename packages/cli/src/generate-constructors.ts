import { ImportedModules } from "./types";

export function generateConstructors(imports: string, modules: ImportedModules): string {


  return [
    imports,
    ...Object.entries(modules).flatMap(([, { interactors, matchers }]) =>
      [
        ...interactors.map(
          ({ newName }) =>
            `export const ${newName} = ${newName}Interactor.builder(i => ({ ...i, typename: "${newName}" }))`
        ),
        ...matchers.map(
          ({ newName }) =>
            `export const ${newName} = ${newName}Matcher.builder(m => ({ ...m, typename: "${newName}" }))`
        )
      ]
    ),
  ].join("\n");
}
