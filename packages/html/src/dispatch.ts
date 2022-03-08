export function dispatchChange(element: HTMLElement): boolean {
  let Event = element.ownerDocument.defaultView?.Event || window.Event;
  return element.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
}

export function dispatchInput(element: HTMLElement, options: InputEventInit = {}): boolean {
  let InputEvent = element.ownerDocument.defaultView?.InputEvent || window.InputEvent;
  return element.dispatchEvent(new InputEvent('input', Object.assign({ bubbles: true, cancelable: false }, options)));
}
