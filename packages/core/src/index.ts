export type { Interactor, InteractorConstructor, InteractorSpecification, EmptyObject, FilterMethods, ActionMethods } from "./specification.ts";
export type { Interaction, ActionInteraction, AssertionInteraction } from './interaction.ts';
export { isInteraction } from './interaction.ts';
export { createInteractor, InitInteractor } from './create-interactor.ts';
export { createInspector } from './inspector.ts'
export { isVisible } from 'element-is-visible';
export { MatcherConstructor, createMatcher } from './matcher.ts';
export type { Matcher, MaybeMatcher } from './matcher.ts';

export { including } from './matchers/including.ts';
export { matching } from './matchers/matching.ts';
export { and } from './matchers/and.ts';
export { or } from './matchers/or.ts';
export { not } from './matchers/not.ts';
export { some } from './matchers/some.ts';
export { every } from './matchers/every.ts';

export { click } from './element/click.ts';
export type { MergeObjects } from './merge-objects.ts'
