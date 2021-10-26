import { describe, it } from 'mocha';
import expect from 'expect';
import { dom } from '../helpers';

import { HTML, matching } from '../../src/index';

describe('@interactors/html', () => {
  beforeEach(() => {
    dom(`
      <div title="hello world"></div>
      <div title="what the heck"></div>
    `);
  });

  describe('matching', () => {
    it('can check whether the given string matching', async () => {
      await HTML({ title: matching(/he(llo|ck)/) }).exists();
      await expect(HTML({ title: matching(/blah/) }).exists()).rejects.toHaveProperty('name', 'NoSuchElementError')
    });
  });
});
