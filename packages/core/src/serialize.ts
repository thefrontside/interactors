/* eslint-disable @typescript-eslint/no-explicit-any */
import { InteractionOptions as SerializedInteractionOptions, InteractionType } from "@interactors/globals";
import { pascalCase } from "change-case";
import { InteractionOptions } from "./interaction";
import { matcherCode } from "./matcher";
import { InteractorOptions } from "./specification";

export function serializeInteractorOptions(options: InteractorOptions<any, any, any>): {
  interactor: string;
  filter: { [name: string]: unknown };
  locator: string;
  code: () => string;
} {
  let locator = matcherCode(options.locator?.value);
  return {
    interactor: options.name,
    filter: options.filter.all,
    locator,
    code() {
      let interactorName = pascalCase(options.name);
      let filters = Object.entries(options.filter.all).map(([name, filter]) => `"${name}": ${matcherCode(filter)}`);
      return `${interactorName}(${[locator, filters.length && `{ ${filters.join(", ")} }`]
        .filter(Boolean)
        .join(", ")})`;
    },
  };
}

export function serializeInteractionOptions<E extends Element, T>(
  type: InteractionType,
  { name, interactor: { options }, args, filters }: InteractionOptions<E, T>
): SerializedInteractionOptions {
  let interactor = serializeInteractorOptions(options);
  let ancestors = options.ancestors.map((ancestor) => serializeInteractorOptions(ancestor));
  return {
    ...interactor,
    ancestors,
    name,
    type,
    args,
    code() {
      let serializedArgs = "";
      if (filters) {
        let serializedFilters = Object.entries(filters).map(([name, filter]) => `"${name}": ${matcherCode(filter)}`);
        serializedArgs = `{ ${serializedFilters.join(", ")} }`;
      } else if (args) {
        serializedArgs = args.map((arg) => JSON.stringify(arg)).join(", ");
      }
      return `${[...ancestors, interactor]
        .map(({ code }, index) => (index == 0 ? code() : `${code()})`))
        .join(".find(")}.${name}(${serializedArgs})`;
    },
  };
}
