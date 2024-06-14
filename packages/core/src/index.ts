export { Interactor, InteractorConstructor, InteractorSpecification, EmptyObject, FilterMethods, ActionMethods, TMatcher, TMatch, TInteractor, TInteraction } from './specification';
export { Interaction, ActionInteraction, AssertionInteraction, isInteraction } from './interaction';
export { createInteractor, InitInteractor } from './create-interactor';
export { createInspector } from './inspector'
export { isVisible } from 'element-is-visible';
export { Matcher, MaybeMatcher, MatcherConstructor, createMatcher } from './matcher';

export { including } from './matchers/including';
export { matching } from './matchers/matching';
export { and } from './matchers/and';
export { or } from './matchers/or';
export { not } from './matchers/not';
export { some } from './matchers/some';
export { every } from './matchers/every';

export { click } from './element/click';
export { MergeObjects } from './merge-objects'
