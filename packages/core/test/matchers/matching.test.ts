import { beforeEach, describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { dom } from '../helpers.ts';

import { createInteractor, matching } from '../../mod.ts';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    title: (e) => e.title,
  });

describe('matching', () => {
  beforeEach(() => {
    dom(`
      <div title="hello world"></div>
      <div title="what the heck"></div>
    `);
  });

  it('can check whether the given string matching', async () => {
    await HTML({ title: matching(/he(llo|ck)/) }).exists();
    await expect(HTML({ title: matching(/blah/) }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can return code representation', () => {
    expect(matching(/he(llo|ck)/).code?.()).toBe('matching(/he(llo|ck)/)')
  })
});
