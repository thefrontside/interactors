import { serve } from '../src/index';
import { main } from 'effection';
import { Heading, Link } from '@interactors/html';
import { JSDOM } from 'jsdom';
import { setDocumentResolver } from '@interactors/globals';

let dom = new JSDOM(`
  <!doctype html>
  <html>
    <h1>Hello World</h1>
    <a href="/foobar">Some Link</a>
  </html>
`);

setDocumentResolver(() => dom.window.document);

main(function*() {
  console.log('[server] starting');
  yield serve(30400, [Heading, Link]);
});
