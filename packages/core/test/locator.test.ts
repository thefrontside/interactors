import { describe, it } from 'mocha';
import expect from 'expect';
import { dom } from './helpers';

import { createInteractor } from '../src';

describe('locator', () => {
  it('can use function as locator', async () => {
    const Paragraph = createInteractor('p')
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

  it('can use object as locator', async () => {
    const Paragraph = createInteractor('p')
      .selector('p')
      .locator({
        apply: (e) => e.id
      });

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

  it('can delegate locator to other interactor', async () => {
    const Span = createInteractor('span').selector('span').filters({
      text: (e) => e.textContent || ""
    });

    const Paragraph = createInteractor('p')
      .selector('p')
      .locator(Span().text());

    dom(`
      <p><span>Foo</span> Quox</p>
      <p><span>Bar</span> Quox</p>
    `);

    await expect(Paragraph('Foo').exists()).resolves.toBeUndefined();
    await expect(Paragraph('Bar').exists()).resolves.toBeUndefined();
    await expect(Paragraph('Quox').exists()).rejects.toHaveProperty('message', [
      'did not find p "Quox", did you mean one of:', '',
      '┃ p       ┃',
      '┣━━━━━━━━━┫',
      '┃ ⨯ "Foo" ┃',
      '┃ ⨯ "Bar" ┃',
    ].join('\n'));
  });
});
