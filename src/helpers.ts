export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
