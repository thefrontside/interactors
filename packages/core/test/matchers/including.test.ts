import { describe, it } from 'node:test';
import expect from 'expect';
import { dom } from '../helpers';

import { createInteractor, including } from '../../src/index';

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
