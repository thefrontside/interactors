import { describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { dom } from './helpers.ts';

import { createInteractor } from '../mod.ts';

describe('selector', () => {
  it('can use string as selector', async () => {
    let Paragraph = createInteractor('p')
      .selector('p')
      .locator((e) => e.id);

    dom(`
      <p id="foo-id">Foo</p>
      <p id="bar-id">Bar</p>
    `);

    await expect(Paragraph('foo-id').exists()).resolves.toBeUndefined();
    await expect(Paragraph('bar-id').exists()).resolves.toBeUndefined();
    await expect(Paragraph('quox-id').exists()).rejects.toHaveProperty('message', [
      'did not find p "quox-id", did you mean one of:', '',
      '┃ p          ┃',
      '┣━━━━━━━━━━━━┫',
      '┃ ⨯ "foo-id" ┃',
      '┃ ⨯ "bar-id" ┃',
    ].join('\n'));
  });

  it('can use function as selector', async () => {
    let Paragraph = createInteractor('p')
      .selector((parentElement) => Array.from(parentElement.querySelectorAll('p')))
      .locator((e) => e.id);

    dom(`
      <p id="foo-id">Foo</p>
      <p id="bar-id">Bar</p>
    `);

    await expect(Paragraph('foo-id').exists()).resolves.toBeUndefined();
    await expect(Paragraph('bar-id').exists()).resolves.toBeUndefined();
    await expect(Paragraph('quox-id').exists()).rejects.toHaveProperty('message', [
      'did not find p "quox-id", did you mean one of:', '',
      '┃ p          ┃',
      '┣━━━━━━━━━━━━┫',
      '┃ ⨯ "foo-id" ┃',
      '┃ ⨯ "bar-id" ┃',
    ].join('\n'));
  });
});
