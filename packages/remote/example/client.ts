import { connect } from '../src/index';
import { main } from 'effection';
import { Heading, Link } from '@interactors/html';

main(function*() {
  console.log("[client] connecting...");
  yield connect('ws://127.0.0.1:30400');
  console.log("[client] connected!");

  yield Heading('Hello World').exists();
  yield Link('Some Link').has({ href: '/incorrect' });
});
