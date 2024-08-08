import { expect, describe, it } from '../deps.ts';
import { dom } from '../helpers.ts';

import { createInteractor, including } from '../../mod.ts';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    title: (e) => e.title,
  });

describe('including', () => {
  it('can check whether the given string is contained', async () => {
    dom(`
      <div title="hello world"></div>
    `);

    await HTML({ title: including('hello') }).exists();
    await HTML({ title: including('world') }).exists();
    await expect(HTML({ title: including('blah') }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can return code representation', () => {
    expect(including('hello').code?.()).toBe('including("hello")')
  })
});
