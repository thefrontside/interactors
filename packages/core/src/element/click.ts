import userEvent from '@testing-library/user-event'

export function click(element: Element, init?: MouseEventInit) {
  return userEvent.click(element, init);
}
