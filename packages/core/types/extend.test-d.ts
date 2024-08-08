import { expectType, expectAssignable, expectError } from 'tsd';
import { createInteractor, type Interactor, type ActionInteraction } from '../mod.ts';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    id: (element) => element.id,
  })
  .actions({
    click: (interactor) => interactor.perform((element) => element.click()),
  });

// cannot pass supertype
expectError(HTML.extend<Element>('foo'));

// cannot pass other random type
expectError(HTML.extend<number>('div'))

// without type parameter
HTML.extend('div')
  .filters({
    id: (element) => {
      expectType<HTMLElement>(element);
      return element.id;
    }
  });

// with type parameter
HTML.extend<HTMLLinkElement>('link')
  .filters({
    href: (element) => {
      expectType<HTMLLinkElement>(element);
      return element.href;
    }
  })
  .actions({
    setHref: (interactor, value: string) => interactor.perform((element) => {
      expectType<HTMLLinkElement>(element);
      element.href = value;
    })
  });

// overriding filters and actions
const Thing = HTML.extend('thing')
  .filters({
    id: () => 4
  })
  .actions({
    click: async (interactor, value: number) => {
      await interactor.perform((element) => {
        element.textContent = `Value: ${value}`;
      });
    }
  })

// uses overridden type for filter
expectAssignable<Interactor<HTMLElement, Record<string, unknown>>>(Thing('thing', { id: 4 }));

// cannot use original type for filter
expectError(Thing('thing', { id: 'thing' }));

// uses overridden type for action
expectType<(value: number) => ActionInteraction<HTMLElement, void>>(Thing('thing').click);

// cannot use original type for action
expectError(Thing('thing').click());
