import { userEvent } from '@testing-library/user-event'

export function click(...args: Parameters<typeof userEvent.click>): ReturnType<typeof userEvent.click> {
  return userEvent.click(...args);
}
