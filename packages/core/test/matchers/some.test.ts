import { describe, it } from '../deps.ts';
import expect from 'expect';
import { dom } from '../helpers.ts';

import { createInteractor, some, including } from '../../mod.ts';

const MultiSelect = createInteractor<HTMLSelectElement>('multi select')
  .selector('select[multiple]')
  .filters({
    id: (e) => e.id,
    values: (e) => Array.from(e.selectedOptions).map((i) => i.label),
  });

describe('some', () => {
  it('can check whether the given string is contained in an array', async () => {
    dom(`
      <select id="colors" multiple>
        <option selected>Red</option>
        <option selected>Blue</option>
        <option selected>Green</option>
        <option selected>Neon Blue</option>
        <option selected>Neon Green</option>
      </select>
    `);

    await MultiSelect({ id: 'colors' }).has({ values: some('Red') });
    await MultiSelect({ id: 'colors' }).has({ values: some(including('Neon')) });
    await expect(MultiSelect({ id: 'colors' }).has({ values: some('Yellow') })).rejects.toHaveProperty('name', 'FilterNotMatchingError')
  });

  it('can return code representation', () => {
    expect(some(including('Neon')).code?.()).toBe('some(including("Neon"))')
  })
});
