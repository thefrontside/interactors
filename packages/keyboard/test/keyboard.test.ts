import { describe, it } from 'mocha';
import { globals, setKeyboardLayout } from '@interactors/globals';
import { createInteractor } from '@interactors/core';
import { Keyboard, createKeyboardLayout } from '../src';
import { dom } from './helpers';

const TextField = createInteractor<HTMLInputElement | HTMLTextAreaElement>('text field')
  .selector('input,textarea')
  .filters({
    id: (e) => e.id,
  })
  .actions({
    focus: ({ perform }) => perform((e) => e.focus()),
  });

const Heading = createInteractor('heading')
  .selector('h1')
  .filters({
    id: (e) => e.id,
    text: (e) => e.textContent,
  })

describe('Keyboard', () => {
  describe('press', () => {
    let domFixture = `
      <p>
        <textarea type="text" id="nameField">hello</textarea>
        <h1 id="keydown"></h1>
        <h1 id="keyup"></h1>
        <h1 id="input"></h1>
      </p>
      <script>
        nameField.addEventListener('keydown', (event) => {
          keydown.textContent = ['success', event.target.value, event.key, event.code].join(' ');
        });
        nameField.addEventListener('keyup', (event) => {
          keyup.textContent = ['success', event.target.value, event.key, event.code].join(' ');
        });
        nameField.addEventListener('input', (event) => {
          input.textContent = ['success', event.target.value, event.inputType, event.data].join(' ');
        });
      </script>
    `;

    it('dispatches events with the given key to the body when no element active', async () => {
      dom(`
        <p>
          <input value="hello" type="text" id="nameField"/>
          <h1 id="keydown"></h1>
          <h1 id="keyup"></h1>
        </p>
        <script>
          document.body.addEventListener('keydown', (event) => {
            keydown.textContent = ['success', event.key, event.code].join(' ');
          });
          document.body.addEventListener('keyup', (event) => {
            keyup.textContent = ['success', event.key, event.code].join(' ');
          });
        </script>
      `);

      await Keyboard.press({ key: 'w' });
      await Heading({ id: 'keydown' }).has({ text: 'success w KeyW' });
      await Heading({ id: 'keyup' }).has({ text: 'success w KeyW' });
    });

    it('dispatches events with the given key to the active element', async () => {
      dom(domFixture);

      await TextField({ id: 'nameField' }).focus();
      await Keyboard.press({ key: 'w' });
      await Heading({ id: 'keydown' }).has({ text: 'success hello w KeyW' });
      await Heading({ id: 'keyup' }).has({ text: 'success hellow w KeyW' });
      await Heading({ id: 'input' }).has({ text: 'success hellow insertText w' });
    });

    it('dispatches events with the given code to the active element', async () => {
      dom(domFixture);


      await TextField({ id: "nameField" }).focus();
      await Keyboard.press({ code: "KeyW" });
      await Heading({ id: "keydown" }).has({ text: "success hello w KeyW" });
      await Heading({ id: "keyup" }).has({ text: "success hellow w KeyW" });
      await Heading({ id: "input" }).has({ text: "success hellow insertText w" });
    });

    it("dispatches events with the `Enter` code to the active element", async () => {
      dom(domFixture);

      await TextField({ id: 'nameField' }).focus();
      await Keyboard.press({ code: 'Home' });
      await Keyboard.press({ code: 'Enter' });
      await Heading({ id: 'keydown' }).has({ text: 'success hello Enter Enter' });
      await Heading({ id: 'keyup' }).has({ text: 'success hello Enter Enter' });
      await Heading({ id: "input" }).has({ text: "" });
    });

    it("dispatches events with the `Dead` key value to the active element", async () => {
      dom(domFixture);

      await TextField({ id: 'nameField' }).focus();
      await Keyboard.press({ key: 'Dead' });
      await Heading({ id: 'keydown' }).has({ text: 'success hello Dead ' });
      await Heading({ id: 'keyup' }).has({ text: 'success hello Dead ' });
      await Heading({ id: "input" }).has({ text: "" });
    });

    it("dispatches events with the uppercased `w` to the active element", async () => {
      dom(domFixture);

      await TextField({ id: 'nameField' }).focus();
      await Keyboard.press({ key: 'W' });
      await Heading({ id: "keydown" }).has({ text: "success hello W KeyW" });
      await Heading({ id: "keyup" }).has({ text: "success helloW W KeyW" });
      await Heading({ id: "input" }).has({ text: "success helloW insertText W" });
    });
  });

  describe('type', () => {
    it('types all of the given keys', async () => {
      dom(`
        <p>
          <input value="hello" type="text" id="nameField"/>
          <h1 id="keydown"></h1>
        </p>
        <script>
          document.body.addEventListener('keydown', (event) => {
            keydown.textContent = [keydown.textContent, event.key].filter(Boolean).join('-');
          });
        </script>
      `);

      globals.document.getElementById('nameField');
      await Keyboard.type('hello');
      await Heading({ id: 'keydown' }).has({ text: 'h-e-l-l-o' });
    });
  });

  describe('layout', () => {
    it('can change keyboard layout', async () => {
      setKeyboardLayout(createKeyboardLayout([
        { code: 'KeyW', key: 'q' },
        { code: 'KeyX', key: 'b' },
      ]));

      dom(`
        <p>
          <input value="hello" type="text" id="nameField"/>
          <h1 id="keydown"></h1>
          <h1 id="keyup"></h1>
        </p>
        <script>
          document.body.addEventListener('keydown', (event) => {
            keydown.textContent = ['success', event.key, event.code].join(' ');
          });
          document.body.addEventListener('keyup', (event) => {
            keyup.textContent = ['success', event.key, event.code].join(' ');
          });
        </script>
      `);

      globals.document.getElementById('nameField');
      await Keyboard.press({ key: 'q' });
      await Heading({ id: 'keydown' }).has({ text: 'success q KeyW' });
    });
  });
});
