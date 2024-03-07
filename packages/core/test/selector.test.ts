import { describe, it } from 'node:test';
import expect from 'expect';
import { dom } from './helpers';

import { createInteractor } from '../src';

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
