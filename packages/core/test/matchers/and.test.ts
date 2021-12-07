import { describe, it } from 'mocha';
import expect from 'expect';
import { dom } from '../helpers';

import { createInteractor, and, including, matching } from '../../src/index';

const HTML = createInteractor<HTMLElement>('html')
  .filters({
    title: (e) => e.title,
  });

describe('and', () => {
  it('can check whether the given value matches all of the given matchers', async () => {
    dom(`
      <div title="hello cruel world"></div>
    `);

    await HTML({ title: and(including('world'), including('hello')) }).exists();
    await HTML({ title: and(including('world'), including('hello'), including('cruel')) }).exists();
    await expect(HTML({ title: and(including('world'), including('monkey')) }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
    await expect(HTML({ title: and(including('monkey'), including('hello')) }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can check whether the given value matches all of the given actual values', async () => {
    dom(`
      <div title="hello"></div>
    `);

    await HTML({ title: and('hello', 'hello') }).exists();
    await expect(HTML({ title: and('hello', 'monkey') }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
  });

  it('can return code representation', () => {
    expect(and('hello', 'world').code?.()).toBe('and("hello", "world")')
    expect(and('hello', including('world')).code?.()).toBe('and("hello", including("world"))')
    expect(and('hello', matching(/world/ig)).code?.()).toBe('and("hello", matching(/world/gi))')
  })
});
