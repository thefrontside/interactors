export type Config = {
  outDir?: string;
  modules: string[];
  overrides?: (module: string, name: string) => string
}
