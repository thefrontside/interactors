import { expectType, expectError } from 'tsd';
import { createInteractor, type ActionInteraction } from '../mod.ts';

let Link = createInteractor<HTMLLinkElement>('link')
  .selector('a')
  .actions({
    click: ({ perform }) => perform(element => { element.click() }),
    setHref: ({ perform }, value: string) => perform((element) => { element.href = value })
  })
  .filters({
    title: (element) => element.title,
    href: (element) => element.href,
    id: (element) => element.id,
    visible: {
      apply: (element) => element.clientHeight > 0,
      default: true
    },
  })

const Div = createInteractor('div')
  .locator((element) => element.id || "")

expectType<ActionInteraction<HTMLLinkElement, void>>(Link('foo').click());

expectType<ActionInteraction<HTMLLinkElement, void>>(Link('foo').setHref('blah'));

// cannot use wrong type of argument on action
expectError(Link('foo').setHref(123));

// cannot use action which is not defined
expectError(Div('foo').click());

expectError(Link('foo').blah());

expectError(Div('foo').blah());
