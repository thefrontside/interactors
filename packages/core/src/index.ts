export type { Interactor, InteractorConstructor, InteractorSpecification, EmptyObject, FilterMethods, ActionMethods } from './specification.ts';
export type { Interaction, ActionInteraction, AssertionInteraction } from './interaction.ts';
export { isInteraction } from './interaction.ts'
export { createInteractor } from './create-interactor.ts';
export { createInspector } from './inspector.ts'
export { isVisible } from 'element-is-visible';
export { createMatcher } from './matcher.ts';
export type { Matcher } from './matcher.ts';
export {
  CONSTRUCTOR_METADATA_VERSION,
  getInteractorConstructorMetadata,
  getMatcherConstructorMetadata,
  isInteractorConstructor,
  isMatcherConstructor,
} from './metadata.ts';
export type {
  InteractorConstructorMetadata,
  MatcherConstructorMetadata,
} from './metadata.ts';

export { including } from './matchers/including.ts';
export { matching } from './matchers/matching.ts';
export { and } from './matchers/and.ts';
export { or } from './matchers/or.ts';
export { not } from './matchers/not.ts';
export { some } from './matchers/some.ts';
export { every } from './matchers/every.ts';

export { click } from './element/click.ts';
export type { MergeObjects } from './merge-objects.ts'
export type { MaybeMatcher } from './matcher.ts'
