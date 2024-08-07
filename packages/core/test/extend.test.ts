import { expect, describe, it } from './deps.ts';
import { dom } from './helpers.ts';

import { Header, Link, Thing, HTML } from './fixtures.ts';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const HTMLWithNoLabel = HTML.extend()

describe('Interactor.extend', () => {
  it('can use filters from base interactor', async () => {
    dom(`
      <p><a href="/foobar" title="Foo">Foo Bar</a></p>
    `);

    await expect(Link('Foo Bar').has({ title: "Foo" })).resolves.toBeUndefined();
    await expect(Link('Foo Bar').has({ title: "Quox" })).rejects.toHaveProperty('message', [
      'link "Foo Bar" does not match filters:', '',
      '╒═ Filter:   title',
      '├─ Expected: "Quox"',
      '└─ Received: "Foo"',
    ].join('\n'));
  });

  it('can use filters from extended interactor', async () => {
    dom(`
      <p><a href="/foobar" title="Foo">Foo Bar</a></p>
    `);

    await expect(Link('Foo Bar').has({ href: "/foobar" })).resolves.toBeUndefined();
    await expect(Link('Foo Bar').has({ href: "/quox" })).rejects.toHaveProperty('message', [
      'link "Foo Bar" does not match filters:', '',
      '╒═ Filter:   href',
      '├─ Expected: "/quox"',
      '└─ Received: "/foobar"',
    ].join('\n'));
  });

  it('can use actions from base interactor', async () => {
    dom(`
      <a id="foo" href="/foobar">Foo Bar</a>
      <div id="target"></div>
      <script>
        foo.onclick = () => {
          target.innerHTML = '<h1>Hello!</h1>';
        }
      </script>
    `);

    await Link('Foo Bar').click();
    await Header('Hello!').exists();
  });

  it('can use actions from extended interactor', async () => {
    dom(`
      <a id="foo" href="/foobar">Foo Bar</a>
    `);

    await Link('Foo Bar').setHref('/monkey');
    await Link({ href: '/monkey' }).exists();
  });

  it('can use overridden filters and actions', async () => {
    dom(`
      <div></div>
    `);

    await Thing().click(4);
    await Thing().has({ title: 4 });
  });

  it('throws error if interactor has no label', async () => {
    dom(`<p>Foo Bar</p>`);
    await expect(HTMLWithNoLabel('Foo Bar').exists()).rejects.toHaveProperty('message', [
      "One of your interactors was created without a name. Please provide a label for your interactor:",
      "\tHTML.extend('my interactor') || createInteractor('my interactor')"
    ].join('\n'));
  });
});
