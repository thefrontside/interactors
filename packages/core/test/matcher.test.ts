import { describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { dom } from './helpers.ts';

import type { Matcher } from '../mod.ts';
import { Link } from './fixtures.ts';

function shouted(value: string): Matcher<string> {
  return {
    match(actual: string): boolean {
      return actual === value.toUpperCase();
    },
    description(): string {
      return `uppercase ${JSON.stringify(value.toUpperCase())}`;
    },
  }
}

describe('matchers', () => {
  it('can use matcher on locator when locating element', async () => {
    dom(`
      <p><a href="/foobar">FOO</a></p>
      <p><a href="/foobar">BAR</a></p>
    `);

    await expect(Link(shouted('Foo')).exists()).resolves.toBeUndefined();
    await expect(Link(shouted('Quox')).exists()).rejects.toHaveProperty('message', [
      'did not find link uppercase "QUOX", did you mean one of:', '',
      '┃ link    ┃',
      '┣━━━━━━━━━┫',
      '┃ ⨯ "FOO" ┃',
      '┃ ⨯ "BAR" ┃',
    ].join('\n'));
  });

  it('can use matcher on filter when locating element', async () => {
    dom(`
      <p><a href="/foobar" title="FOO">Foo Bar</a></p>
      <p><a href="/foobar" title="BAR">Quox</a></p>
    `);

    await expect(Link('Foo Bar', { title: shouted('foo') }).exists()).resolves.toBeUndefined();
    await expect(Link('Foo Bar', { title: shouted('bar') }).exists()).rejects.toHaveProperty('message', [
      'did not find link "Foo Bar" with title uppercase "BAR", did you mean one of:', '',
      '┃ link        ┃ title: uppercase "BAR" ┃',
      '┣━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━┫',
      '┃ ✓ "Foo Bar" ┃ ⨯ "FOO"                ┃',
      '┃ ⨯ "Quox"    ┃ ✓ "BAR"                ┃',
    ].join('\n'));
  });

  it('can use matcher on filter when matching element', async () => {
    dom(`
      <p><a href="/foobar" title="FOO">Foo Bar</a></p>
      <p><a href="/foobar" title="BAR">Quox</a></p>
    `);

    await expect(Link('Foo Bar').has({ title: shouted('foo') })).resolves.toBeUndefined();
    await expect(Link('Foo Bar').has({ title: shouted('bar') })).rejects.toHaveProperty('message', [
      'link "Foo Bar" does not match filters:', '',
      '╒═ Filter:   title',
      '├─ Expected: uppercase "BAR"',
      '└─ Received: "FOO"',
    ].join('\n'));
  });

  it('can use regex on locator when locating element', async () => {
    dom(`
      <p><a href="/foobar">FOO</a></p>
      <p><a href="/foobar">BAR</a></p>
    `);

    await expect(Link(/foo/i).exists()).resolves.toBeUndefined();
    await expect(Link(/quox/i).exists()).rejects.toHaveProperty('message', [
      'did not find link matching /quox/i, did you mean one of:', '',
      '┃ link    ┃',
      '┣━━━━━━━━━┫',
      '┃ ⨯ "FOO" ┃',
      '┃ ⨯ "BAR" ┃',
    ].join('\n'));
  })
});
