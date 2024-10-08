type HTMLTypes<T> = T extends `HTML${infer C}Element` ? C : never;

type HTMLElementTypes = HTMLTypes<keyof typeof window>;

export function isHTMLElement<T extends HTMLElementTypes = "">(
  element: unknown | null | undefined,
  type: T = "" as T
): element is InstanceType<typeof window[`HTML${T}Element`]> {
  if(element) {
    let { defaultView } = (element as Element).ownerDocument;
    let Constructor = (defaultView as unknown as Record<string, unknown>)?.[`HTML${type}Element`];
    return typeof Constructor == "function" && element instanceof Constructor;
  } else {
    return false;
  }
}
export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isDisabled<T extends Element>(element: T): boolean;
export function isDisabled<T extends Element>(element?: T | null): boolean | undefined;
export function isDisabled<T extends Element>(element?: T | null): boolean | undefined {
  if (isHTMLElement(element, "Button")) return element.disabled;
  return element ? element.getAttribute("aria-disabled") == "true" : undefined;
}

export function getInputLabel(
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): HTMLLabelElement | undefined {
  return (
    input.labels?.[0] ??
    input.previousElementSibling
      ?.getAttribute("aria-labelledby")
      ?.split(" ")
      .map((labelId) => input.ownerDocument.getElementById(labelId))
      .map((element) => (isHTMLElement(element, "Label") ? element : null))
      .find(isDefined) ??
    [input.parentElement?.previousElementSibling]
      .map((element) => (isHTMLElement(element, "Label") ? element : null))
      .find(isDefined)
  );
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
  let Event = element.ownerDocument.defaultView?.Event || globalThis.Event;
  return element.dispatchEvent(new Event("change", { bubbles: true, cancelable: false }));
}

export function dispatchMouseDown(element: HTMLElement, options: MouseEventInit = {}): boolean {
  let MouseEvent = element.ownerDocument.defaultView?.MouseEvent || globalThis.MouseEvent;
  return element.dispatchEvent(
    new MouseEvent("mousedown", Object.assign({ bubbles: true, cancelable: true }, options))
  );
}
