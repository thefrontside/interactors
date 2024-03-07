import { describe, it } from 'node:test';
import expect from 'expect';

import { dom } from './helpers';

import { Page } from '../src';

describe('Page', () => {
  describe('filter `title`', () => {
    it('can check the page title', async() => {
      let window = dom('');
      window.document.title = 'Hello World';

      await expect(Page.has({ title: 'Hello World' })).resolves.toBeUndefined();
      await expect(Page.has({ title: 'Does Not Exist' })).rejects.toHaveProperty('message', [
        'Page does not match filters:', '',
        '╒═ Filter:   title',
        '├─ Expected: "Does Not Exist"',
        '└─ Received: "Hello World"',
      ].join('\n'))
    });
  });

  describe('filter `url`', () => {
    it('can check the page url', async() => {
      dom('');

      await expect(Page.has({ url: 'about:blank' })).resolves.toBeUndefined();
      await expect(Page.has({ url: 'does-not-exist' })).rejects.toHaveProperty('message', [
        'Page does not match filters:', '',
        '╒═ Filter:   url',
        '├─ Expected: "does-not-exist"',
        '└─ Received: "about:blank"',
      ].join('\n'))
    });
  });
});
