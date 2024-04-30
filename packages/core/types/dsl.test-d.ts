import { expectType, expectError } from 'tsd';
import { test, TestBuilder } from '@bigtest/suite';
import { createInteractor } from '../src/index';

const TextField = createInteractor<HTMLInputElement>('text field')
  .selector('input')
  .locator((element) => element.id)
  .filters({
    enabled: {
      apply: (element) => !element.disabled,
      default: true
    },
    value: (element) => element.value
  })
  .actions({
    fillIn: ({ perform }, value: string) => perform((element) => { element.value = value })
  });

expectType<TestBuilder<Record<string, unknown>>>(
  test("using interactors")
    .step(TextField("username").fillIn("cowboyd"))
    .step(TextField("password").fillIn("secret"))
    .assertion(TextField("username").exists())
)

expectError(
  test("bad interactor usage")
  // cannot use side-effect interactions in an assertion
  .assertion(TextField("username").fillIn('cowboyd'))
)
