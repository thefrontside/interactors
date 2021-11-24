export { Interactor, InteractorConstructor, InteractorSpecification } from './specification';
export { Interaction, ReadonlyInteraction, isInteraction } from './interaction';
export { createInteractor } from './create-interactor';
export { createInspector } from './inspector'
export { perform } from './perform';
export { focused, focus, blur } from './focused';
export { isVisible } from 'element-is-visible';
export { Matcher } from './matcher';
export * from './dispatch';

export { including } from './matchers/including';
export { matching } from './matchers/matching';
export { and } from './matchers/and';
export { or } from './matchers/or';
export { not } from './matchers/not';
export { some } from './matchers/some';
export { every } from './matchers/every';

export { fillIn } from './element/fill-in';
export { click } from './element/click';
