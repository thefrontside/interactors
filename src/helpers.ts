export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO Reuse it in Select
// TODO Use TextField component for select tests
export const createFormFieldFilters = <E extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>() => ({
  valid: (element: E) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element: E) => element.required,
  description: (element: E) => {
    const descriptionId = element.getAttribute("aria-describedby");
    const descriptionElement = descriptionId ? element.ownerDocument.getElementById(descriptionId) : null;
    return descriptionElement?.innerText ?? "";
  },
});

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
