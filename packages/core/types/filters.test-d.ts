import { expectType, expectAssignable, expectError } from 'tsd';
import { createInteractor, Interactor, AssertionInteraction } from '../src/index';

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

const Div = createInteractor('div')
  .locator((element) => element.id || "");

expectAssignable<Interactor<HTMLInputElement, Record<string, unknown>>>(TextField('foo', { enabled: true, value: 'thing' }));

expectAssignable<Interactor<HTMLInputElement, Record<string, unknown>>>(TextField('foo', { enabled: false }));

expectType<AssertionInteraction<HTMLInputElement, void>>(TextField('foo').has({ value: 'thing' }));
expectType<AssertionInteraction<HTMLInputElement, void>>(TextField('foo').is({ enabled: true }));

// cannot use wrong type of filter

expectError(TextField('foo', { enabled: 'thing' }));
expectError(TextField('foo', { value: true }));
expectError(TextField('foo', { value: 123 }));

// cannot use filter which doesn't exist

expectError(TextField('foo', { blah: 'thing' }));

expectError(TextField({ blah: 'thing' }));

// cannot use wrong type of filter with is

expectError(TextField('foo').is({ enabled: 'thing' }));
expectError(TextField('foo').is({ value: true }));
expectError(TextField('foo').is({ value: 123 }));

// cannot use filter which doesn't exist with is

expectError(TextField('foo').is({ blah: 'thing' }));

// cannot use wrong type of filter with has

expectError(TextField('foo').has({ enabled: 'thing' }));
expectError(TextField('foo').has({ value: true }));
expectError(TextField('foo').has({ value: 123 }));

// cannot use filter which doesn't exist with has

expectError(TextField('foo').has({ blah: 'thing' }));

// cannot use filter on interactor which has no filters
// TODO: this should fail!
// expectError(Div('foo').has({ blah: 'thing' }));
