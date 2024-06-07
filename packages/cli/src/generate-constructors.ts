import { ImportedModules } from "./types";

export function generateConstructors(imports: string, modules: ImportedModules): string {
  return [
    imports,
    ...Object.entries(modules).flatMap(([, { interactors, matchers }]) =>
      [
        ...interactors.map(
          ({ name }) =>
            `export const ${name} = ${name}Interactor.builder()`
        ),
        ...matchers.map(
          ({ name }) =>
            `export const ${name} = ${name}Matcher.builder()`
        )
      ]
    ),
  ].join("\n");
}
