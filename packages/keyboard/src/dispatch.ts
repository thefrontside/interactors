export function dispatchChange(element: HTMLElement): boolean {
  let Event = element.ownerDocument.defaultView?.Event || globalThis.Event;
  return element.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
}

export function dispatchInput(element: HTMLElement, options: InputEventInit = {}): boolean {
  let InputEvent = element.ownerDocument.defaultView?.InputEvent || globalThis.InputEvent;
  return element.dispatchEvent(new InputEvent('input', Object.assign({ bubbles: true, cancelable: false }, options)));
}

export function dispatchKeyDown(element: HTMLElement, options: KeyboardEventInit = {}): boolean {
  let KeyboardEvent = element.ownerDocument.defaultView?.KeyboardEvent || globalThis.KeyboardEvent;
  return element.dispatchEvent(new KeyboardEvent('keydown', Object.assign({ bubbles: true, cancelable: true }, options)));
}

export function dispatchKeyUp(element: HTMLElement, options: KeyboardEventInit = {}): boolean {
  let KeyboardEvent = element.ownerDocument.defaultView?.KeyboardEvent || globalThis.KeyboardEvent;
  return element.dispatchEvent(new KeyboardEvent('keyup', Object.assign({ bubbles: true, cancelable: true }, options)));
}
