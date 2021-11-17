import { describe, it } from 'mocha';
import expect from 'expect';
import { FieldSet } from '../src/index';
import { dom } from './helpers';

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
