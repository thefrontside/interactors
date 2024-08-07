import { expect, describe, it } from '../deps.ts';
import { dom } from '../helpers.ts';

import { createInteractor, every, including } from '../../mod.ts';

const MultiSelect = createInteractor<HTMLSelectElement>('multi select')
  .selector('select[multiple]')
  .filters({
    id: (e) => e.id,
    values: (e) => Array.from(e.selectedOptions).map((i) => i.label),
  });

describe('every', () => {
  it('can check whether the given string is contained in an array', async () => {
    dom(`
      <select id="colors" multiple>
        <option selected>Neon Blue</option>
        <option selected>Neon Green</option>
      </select>
    `);

    await MultiSelect({ id: 'colors' }).has({ values: every(including('Neon')) });
    await expect(MultiSelect({ id: 'colors' }).has({ values: every(including('Blue')) })).rejects.toHaveProperty('name', 'FilterNotMatchingError')
  });

  it('can return code representation', () => {
    expect(every('hello').code?.()).toBe('every("hello")')
    expect(every(including('Neon')).code?.()).toBe('every(including("Neon"))')
  })
});
