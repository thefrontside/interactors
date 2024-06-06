export type Config = {
  outDir?: string;
  modules: string[];
  overrides?: (module: string, name: string) => string
}

export type ImportedModules = Record<string, {
  interactors: { oldName: string, newName: string }[]
  matchers: { oldName: string, newName: string }[]
}>
