import { beforeEach } from "mocha";
import { DOMWindow, JSDOM } from "jsdom";
import { addInteractionWrapper, globals, setDocumentResolver, setInteractorTimeout } from "@interactors/globals";
//import { run } from 'effection';

let jsdom: JSDOM;
let removeWrapper: () => void;
let removeWrapper2: () => void;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);
  removeWrapper = addInteractionWrapper((_, oper) => oper);
  // removeWrapper2 = addInteractionWrapper((_, oper) => () => oper);

  return jsdom.window;
}

beforeEach(() => {
  globals.reset();
  setInteractorTimeout(20);
});

afterEach(() => {
  removeWrapper?.();
  removeWrapper2?.();
  jsdom?.window?.close();
});
