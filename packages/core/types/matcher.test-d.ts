import { expectType, expectAssignable, expectError } from 'tsd';
import { createInteractor, type Matcher, type Interactor, type AssertionInteraction  } from '../mod.ts';

function shouted(value: string): Matcher<string> {
  return {
    match(actual: string): boolean {
      return actual === value.toUpperCase();
    },
    description(): string {
      return value.toUpperCase();
    }
  }
}

let isEven: Matcher<number> = {
  match(actual: number): boolean {
    return actual % 2 === 0;
  },
  description(): string {
    return "is even";
  }
}

let Link = createInteractor<HTMLLinkElement>('whatever')
  .filters({
    href: (element) => element.href,
    number: () => 3
  })

//// With filter

expectAssignable<Interactor<HTMLLinkElement, Record<string, unknown>>>(Link({ href: shouted("Foobar") }));
expectAssignable<Interactor<HTMLLinkElement, Record<string, unknown>>>(Link({ number: isEven }));

expectError(Link({ href: isEven }));

expectError(Link({ href: { not: "a matcher" } }));

//// With filter matcher

expectType<AssertionInteraction<HTMLLinkElement, void>>(Link().has({ href: shouted("Foobar") }));
expectType<AssertionInteraction<HTMLLinkElement, void>>(Link().has({ number: isEven }));

expectError(Link().has({ href: { not: "a matcher" } }));

expectError(Link().has({ href: isEven }));

//// With locator

expectAssignable<Interactor<HTMLLinkElement, Record<string, unknown>>>(Link(shouted("Foobar")));

// TODO: this should be rejected, but it will require breaking backward compatibility with the specification syntax
// expectError(Link(isEven));

expectError(Link(isEven, { href: "foo" }));

expectError(Link({ not: "a matcher" }));
