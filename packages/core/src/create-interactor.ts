import type { EmptyObject, InteractorConstructor } from './specification.ts';
import { createConstructor } from './constructor.ts';

/**
 * Create a custom interactor with the given name.
 *
 * ### Creating a simple interactor
 *
 * ``` typescript
 * let Paragraph = createInteractor('paragraph').selector('p');
 * ```
 *
 * Note the double function call!
 *
 * @param interactorName The human readable name of the interactor, used mainly for debugging purposes and error messages
 * @typeParam E The type of DOM Element that this interactor operates on. By specifying the element type, actions and filters defined for the interactor can be type checked against the actual element type.
 * @returns You will need to call the returned builder to create an interactor.
 */
export function createInteractor<E extends Element>(name: string): InteractorConstructor<E, EmptyObject, EmptyObject, EmptyObject> {
  return createConstructor(name, {});
}
