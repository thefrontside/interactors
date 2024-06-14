export function generateConstructors(
  imports: { [moduleName: string]: { interactors: { name: string }[], matchers: { name: string }[] } },
  transformPath?: string,
): string {
  return [
    ...Object.entries(imports).map(
      ([moduleName, { interactors, matchers }]) =>
        `import { ${[
          ...interactors.map(({ name }) => (`${name} as ${name}Interactor`)),
          ...matchers.map(({ name }) => (`${name} as ${name}Matcher`)),
        ].join(", ")} } from '${moduleName}'`
    ),
    transformPath ? `import { transform } from "${transformPath}"` : "",
    ...Object.entries(imports).map(
      ([, { interactors, matchers }]) =>
        [
          ...interactors.map(({ name }) => `export const ${name} = ${name}Interactor.builder(${transformPath ? "transform" : "x => x"})`),
          ...matchers.map(({ name }) => `export const ${name} = ${name}Matcher.builder(${transformPath ? "transform" : "x => x"})`)
        ].join("\n")
    ),
  ].join("\n");
}
