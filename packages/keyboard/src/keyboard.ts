import { FunctionalKeys, globals, KeyCode, KeyValue } from '@interactors/globals';
import { createInteractor } from '@interactors/core';
import { dispatchInput, dispatchKeyDown, dispatchKeyUp } from './dispatch';

export interface KeyOptions<K extends string> {
  key?: K;
  code?: KeyCode;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  repeat?: boolean;
}

const KeyboardInteractor = createInteractor('Keyboard')
  .selector(':root')
  .actions({
    async press(interactor, options: KeyOptions<string> | KeyOptions<KeyValue> = {}) {
      await interactor.perform((element) => {
        let activeElement = (element.ownerDocument.activeElement || element.ownerDocument.body) as HTMLElement;
        if(options.key && !options.code) {
          options = { ...options, ...globals.keyboardLayout.getByKey(options.key) };
        }
        if(options.code && !options.key) {
          options = { ...options, ...globals.keyboardLayout.getByCode(options.code) };
        }
        let isFunctionalKey = options.code ? FunctionalKeys.includes(options.code) : false;
        if(dispatchKeyDown(activeElement, options) && isTextElement(activeElement) && !isFunctionalKey) {
          // don't change the value if the keydown event was stopped
          setValue(activeElement, activeElement.value + options.key);
          // input is not dispatched if the keydown event was stopped
          dispatchInput(activeElement, { inputType: 'insertText', data: options.key });
        }
        // keyup is always dispatched
        dispatchKeyUp(activeElement, options);
      });
    },

    async type(interactor, value: string) {
      for(let letter of value) {
        await Keyboard.press({ key: letter });
      }
    },
  });

export const Keyboard = KeyboardInteractor();

export function isTextElement(element: Element): element is HTMLInputElement | HTMLTextAreaElement {
  return element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA';
}

/**
 * Use the prototype setter of the element in order to set the value, that way any behavior that monkey patches
 * the element itself is circumvented. This has the effect of the value just "magically" appearing on the input
 * element just like it does when the browser sets the value because of the default action of an event.
 * We have to do this because React actually does do this monkey-patching as an optimization. Basically, they
 * short-circuit syncing the react state whenever someone sets input.value and then ignore the next `change` event.
 *
 * See https://github.com/cypress-io/cypress/issues/536
 */
export function setValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  let property = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value');
  if (property && property.set) {
    property.set.call(element, value);
  } else {
    // if the value property on the element protoype is not present
    // then there are worse problems. But this is very typesafe!
    element.value = value;
  }
}
