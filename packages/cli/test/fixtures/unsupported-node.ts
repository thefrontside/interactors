import { createInteractor } from "@interactors/core";
import { basename } from "node:path";

export const Unsafe = createInteractor(basename("/unsafe"))
  .selector("div");
