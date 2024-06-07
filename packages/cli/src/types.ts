export type ImportedModules = Record<string, {
  interactors: { name: string }[]
  matchers: { name: string }[]
}>
