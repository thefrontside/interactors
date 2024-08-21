import { describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { FieldSet } from '../mod.ts';
import { dom } from './helpers.ts';

describe('@interactors/html', () => {
  describe('FieldSet', () => {
    it('finds `fieldset` tags by legend', async () => {
      dom(`
        <fieldset id="foo-id">
          <legend>Foo</legend>
        </fieldset>
        <fieldset id="bar-id">
          <legend>Bar</legend>
          Quox
        </fieldset>
      `);

      await expect(FieldSet('Foo').exists()).resolves.toBeUndefined();
      await expect(FieldSet('Bar').exists()).resolves.toBeUndefined();
      await expect(FieldSet('Quox').exists()).rejects.toHaveProperty('name', 'NoSuchElementError');
    });
  });
});
