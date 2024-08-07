import { expect, describe, it } from '../deps.ts';
import { dom } from '../helpers.ts';

import { createInteractor, not, including } from '../../mod.ts';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    id: (e) => e.id,
    title: (e) => e.title,
  });

const div = HTML({ id: "test-div" });

describe('not', () => {
  it('can check whether the filter does not match the given matcher', async () => {
    dom(`
      <div id="test-div" title="hello cruel world"></div>
    `);

    await div.has({ title: not(including("monkey")) });
    await expect(div.has({ title: not(including('world')) })).rejects.toHaveProperty('name', 'FilterNotMatchingError');
  });

  it('can check whether the filter does not match the given literal value', async () => {
    dom(`
      <div id="test-div" title="hello"></div>
    `);

    await div.has({ title: not('monkey') });
    await expect(div.has({ title: not('hello') })).rejects.toHaveProperty('name', 'FilterNotMatchingError');
  });

  it('can return code representation', () => {
    expect(not(including('monkey')).code?.()).toBe('not(including("monkey"))')
  })
});
