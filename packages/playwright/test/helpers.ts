import { createHash } from "node:crypto";
import type {
  Registry,
  RegistryInteractor,
  RegistryMatcher,
} from "../src/protocol.ts";

export function createTestRegistry(options: {
  interactors?: readonly RegistryInteractor[];
  matchers?: readonly RegistryMatcher[];
} = {}): Registry {
  let interactors = options.interactors ?? [
    {
      id: "Form",
      name: "form",
      actions: [],
      filters: [],
    },
    {
      id: "MultiSelect",
      name: "multi select",
      actions: [],
      filters: ["values"],
    },
    {
      id: "TextField",
      name: "text field",
      actions: ["fillIn"],
      filters: ["disabled", "value"],
    },
  ];
  let matchers = options.matchers ?? [
    { id: "and", name: "and" },
    { id: "every", name: "every" },
    { id: "including", name: "including" },
    { id: "matching", name: "matching" },
    { id: "not", name: "not" },
    { id: "or", name: "or" },
    { id: "sameLength", name: "same length" },
    { id: "some", name: "some" },
  ];
  let content = {
    protocolVersion: 1 as const,
    interactors,
    matchers,
  };
  let registryHash = `sha256:${
    createHash("sha256").update(JSON.stringify(content)).digest("hex")
  }`;
  return { ...content, registryHash };
}
