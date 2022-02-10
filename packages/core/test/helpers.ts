import { beforeEach } from "mocha";
import { DOMWindow, JSDOM } from "jsdom";
import { addInteractionWrapper, globals, setDocumentResolver, setInteractorTimeout } from "@interactors/globals";

let jsdom: JSDOM;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);
  addInteractionWrapper((_, oper) => async () => oper);
  addInteractionWrapper((_, oper) => async () => oper);

  return jsdom.window;
}

beforeEach(() => {
  globals.reset();
  setInteractorTimeout(20);
});

afterEach(() => {
  jsdom?.window?.close();
});
