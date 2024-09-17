import { describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { dom } from '../helpers.ts';

import { createInteractor, or, including } from '../../mod.ts';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    title: (e) => e.title,
  });

describe('or', () => {
  it('can check whether the given value matches any of the given matchers', async () => {
    dom(`
      <div title="hello cruel world"></div>
    `);

    await HTML({ title: or(including('world'), including('hello')) }).exists();
    await HTML({ title: or(including('world'), including('blah')) }).exists();
    await expect(HTML({ title: or(including('blah'), including('monkey')) }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can check whether the given value matches any of the given actual values', async () => {
    dom(`
      <div title="hello"></div>
    `);

    await HTML({ title: or('hello', 'world') }).exists();
    await expect(HTML({ title: or('blah', 'monkey') }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can return code representation', () => {
    expect(or('hello', 'world').code?.()).toBe('or("hello", "world")')
  })
});
