import { ImportedModules } from "./types";

export function generateImports(modules: ImportedModules): string {
  return [
    ...Object.entries(modules).map(
      ([moduleName, { interactors, matchers }]) =>
        `import { ${[
          ...interactors.map(({ name }) => (`${name} as ${name}Interactor`)),
          ...matchers.map(({ name }) => (`${name} as ${name}Matcher`)),
        ].join(", ")} } from '${moduleName}'`
    ),
    `const InteractorTable = {${Object.values(modules)
      .flatMap(({ interactors }) => interactors.map(({ name }) => `${name}: ${name}Interactor`))
      .join(", ")}}`,
    `const MatcherTable = {${Object.values(modules)
      .flatMap(({ matchers }) => matchers.map(({ name }) => `${name}: ${name}Matcher`))
      .join(", ")}}`,
  ].join("\n");
}
