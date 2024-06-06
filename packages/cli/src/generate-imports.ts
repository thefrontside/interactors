import { ImportedModules } from "./types";

export function generateImports(modules: ImportedModules): string {
  return [
    ...Object.entries(modules).map(
      ([moduleName, { interactors, matchers }]) =>
        `import { ${[
          ...interactors.map(({ oldName, newName }) => (`${oldName} as ${newName}Interactor`)),
          ...matchers.map(({ oldName, newName }) => (`${oldName} as ${newName}Matcher`)),
        ].join(", ")} } from '${moduleName}'`
    ),
    `const InteractorTable = {${Object.values(modules)
      .flatMap(({ interactors }) => interactors.map(({ newName }) => `${newName}: ${newName}Interactor`))
      .join(", ")}}`,
    `const MatcherTable = {${Object.values(modules)
      .flatMap(({ matchers }) => matchers.map(({ newName }) => `${newName}: ${newName}Matcher`))
      .join(", ")}}`,
  ].join("\n");
}
