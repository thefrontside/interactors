import { describe, it } from 'mocha';
import expect from 'expect';
import { Details } from '../src/index';
import { dom } from './helpers';

describe('@interactors/html', () => {
  describe('Details', () => {
    it('finds `h1`, `h2`, etc... tags by text', async () => {
      dom(`
        <details>
          <summary>Foo</summary>
        </details>
        <details>
          <summary>Bar</summary>
          Quox
        </details>
      `);

      await expect(Details('Foo').exists()).resolves.toBeUndefined();
      await expect(Details('Bar').exists()).resolves.toBeUndefined();
      await expect(Details('Quox').exists()).rejects.toHaveProperty('name', 'NoSuchElementError');
    });

    describe('filter `open`', () => {
      it('filters details tags by whether they are open', async () => {
        dom(`
          <details open>
            <summary>Foo</summary>
          </details>
        `);

        await expect(Details('Foo', { open: true }).exists()).resolves.toBeUndefined();
        await expect(Details('Foo', { open: false }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError');
      });
    });

    describe('.toggle', () => {
      it('toggles whether details tag is open or closed', async () => {
        dom(`
          <details open>
            <summary>Foo</summary>
          </details>
        `);

        await Details('Foo').toggle();
        await Details('Foo').is({ open: false });
      });
    });
  });
});
