import { bigtestGlobals } from "@bigtest/globals";

type HTMLTypes<T> = T extends `HTML${infer C}Element` ? C : never;

type HTMLElementTypes = HTMLTypes<keyof typeof window>;

export function isHTMLElement<T extends HTMLElementTypes = "">(
  element: unknown | null | undefined,
  type: T = "" as T
): element is InstanceType<typeof window[`HTML${T}Element`]> {
  const { defaultView } = bigtestGlobals.document;
  const Constructor = (defaultView as any)?.[`HTML${type}Element`];
  return typeof Constructor == "function" && element instanceof Constructor;
}
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// NOTE: Copy-paste from https://github.com/thefrontside/bigtest/blob/v0/packages/interactor/src/fill-in.ts
export function setValue(element: HTMLInputElement, value: string): void {
  let property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value");
  if (property && property.set) {
    property.set.call(element, value);
  } else {
    // if the value property on the element protoype is not present
    // then there are worse problems. But this is very typesafe!
    element.value = value;
  }
}

export function dispatchChange(element: HTMLElement): boolean {
  let Event = element.ownerDocument.defaultView?.Event || window.Event;
  return element.dispatchEvent(new Event("change", { bubbles: true, cancelable: false }));
}

export function dispatchMouseDown(element: HTMLElement, options: MouseEventInit = {}): boolean {
  let MouseEvent = element.ownerDocument.defaultView?.MouseEvent || window.MouseEvent;
  return element.dispatchEvent(
    new MouseEvent("mousedown", Object.assign({ bubbles: true, cancelable: true }, options))
  );
}

// NOTE: Copy-paste from https://github.com/thefrontside/bigtest/blob/v0/packages/interactor/src/definitions/html.ts
export function innerText(element?: HTMLElement): string {
  return (element?.innerText != null ? element?.innerText : element?.textContent) || "";
}
