/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionOptions as SerializedActionOptions,
  InteractorOptions as SerializedInteractorOptions,
} from "@interactors/globals";
import { matcherCode } from "./matcher";
import { ActionOptions, InteractorOptions } from "./specification";

export function serializeInteractorOptions(options: InteractorOptions<any, any, any>): SerializedInteractorOptions {
  let locator = matcherCode(options.locator?.value);
  let filters: string[] = [];
  for (let name in options.filter.all) {
    filters.push(`"${name}": ${matcherCode(options.filter.all[name])}`);
  }
  let code = `${options.name}(${[locator, filters.length && `{ ${filters.join(", ")} }`].filter(Boolean).join(", ")})`;
  return {
    interactorName: options.name,
    locator,
    filter: options.filter.all,
    code,
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
  let args = "";
  if ("filters" in restOptions) {
    let filters: string[] = [];
    for (let name in restOptions.filters) {
      filters.push(`"${name}": ${matcherCode(restOptions.filters[name])}`);
    }
    args = `{ ${filters.join(", ")} }`;
  } else if ("args" in restOptions) {
    args = (restOptions.args ?? []).map((arg) => JSON.stringify(arg)).join(", ");
  }
  let code = `${[...ancestors, interactor]
    .map(({ code }, index) => (index == 0 ? code : `${code})`))
    .join(".find(")}.${actionName}(${args})`;
  return {
    interactor,
    actionName,
    type,
    args: "filters" in restOptions ? [restOptions.filters] : "args" in restOptions ? restOptions.args : undefined,
    code,
  };
}
