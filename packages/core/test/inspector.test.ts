import { describe, it } from 'node:test';
import expect from 'expect';
import { dom } from './helpers';

import { createInspector, including } from '../src';
import { Div, Link } from './fixtures';

describe('inspector', () => {
  it('.find', async () => {
    dom(`
      <div><a href="/foo">Foo</a></div>
      <div><a href="/bar&quot;">Foo</a></div>
    `);

    let divs = createInspector(Div).all()

    expect(divs.length).toEqual(2)

    let links = divs.map(div => div.find(Link).all()).reduce((a, b) => a.concat(b))

    await expect(Promise.all(links.map(e => e.has({ href: including('/') })))).resolves.toEqual([undefined, undefined])
  });
});
