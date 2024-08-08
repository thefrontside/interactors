import { expect, describe, it } from './deps.ts';
import { dom } from './helpers.ts';

import { createInteractor } from '../mod.ts';

describe('locator', () => {
  it('can use function as locator', async () => {
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

  it('can use object as locator', async () => {
    let Paragraph = createInteractor('p')
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

  it('can delegate locator to other interactor filter', async () => {
    let Span = createInteractor('span').selector('span').filters({
      text: (e) => e.textContent || ""
    });

    let Paragraph = createInteractor('p')
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

  it('can delegate locator to other interactor locator', async () => {
    let Span = createInteractor('span').selector('span');

    let Paragraph = createInteractor('p')
      .selector('p')
      .locator(Span());

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
