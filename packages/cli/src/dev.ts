import { BuildOptions } from "./build";

export interface DevOptions extends BuildOptions {
  outDir: string;
}
export function* dev(options: DevOptions): Operation<void> {
  
}
