import { Interactor } from '@interactors/core';
import { dispatchChange, dispatchInput } from './dispatch';
import { Keyboard, setValue } from './keyboard';

type TextFieldElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Fill in text into an element by emulating how a user would do it, first
 * focusing the element, then filling in the text letter by letter, generating
 * the appropriate keyboard events. hello
 *
 * @param element The element to fill in text in
 * @param value The text value to fill in
 */
export async function fillIn(interactor: Interactor<TextFieldElement, any>, value: string): Promise<void> {
  let originalValue
  await interactor.perform((element) => originalValue = element.value);

  await interactor.perform((element) => element.focus());

  await interactor.perform((element) => {
    if(element.value.length) {
      setValue(element, "");
      dispatchInput(element, { inputType: 'deleteContentBackward', data: null });
    }
  });
  await Keyboard.type(value);

  if(originalValue !== value) {
    await interactor.perform(dispatchChange);
  }

  await interactor.perform((element) => element.blur());
}
