/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionOptions as SerializedActionOptions,
  InteractorOptions as SerializedInteractorOptions,
} from "@interactors/globals";
import { pascalCase } from "change-case";
import { matcherCode } from "./matcher";
import { ActionOptions, InteractorOptions } from "./specification";

export function serializeInteractorOptions(options: InteractorOptions<any, any, any>): SerializedInteractorOptions {
  let locator = matcherCode(options.locator?.value);
  return {
    interactorName: options.name,
    filter: options.filter.all,
    locator,
    get code() {
      let interactorName = pascalCase(options.name);
      let filters = Object.entries(options.filter.all).map(([name, filter]) => `"${name}": ${matcherCode(filter)}`);
      return `${interactorName}(${[locator, filters.length && `{ ${filters.join(", ")} }`].filter(Boolean).join(", ")})`;
    },
  };
}

export function serializeActionOptions({
  type,
  actionName,
  options,
  ...restOptions
}: ActionOptions): SerializedActionOptions {
  let interactor = serializeInteractorOptions(options);
  let ancestors = options.ancestors.map((ancestor) => serializeInteractorOptions(ancestor));
  return {
    interactor,
    actionName,
    type,
    args: "filters" in restOptions ? [restOptions.filters] : "args" in restOptions ? restOptions.args : undefined,
    get code() {
      let args = "";
      if ("filters" in restOptions) {
        let filters = Object.entries(restOptions.filters ?? {}).map(
          ([name, filter]) => `"${name}": ${matcherCode(filter)}`
        );
        args = `{ ${filters.join(", ")} }`;
      } else if ("args" in restOptions) {
        args = (restOptions.args ?? []).map((arg) => JSON.stringify(arg)).join(", ");
      }
      return `${[...ancestors, interactor]
        .map(({ code }, index) => (index == 0 ? code : `${code})`))
        .join(".find(")}.${actionName}(${args})`;
    },
  };
}
