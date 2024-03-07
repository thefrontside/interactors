import { afterEach, beforeEach } from "node:test";
import { DOMWindow, JSDOM } from "jsdom";
import { globals, setDocumentResolver, setInteractorTimeout } from "@interactors/globals";

let jsdom: JSDOM;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);

  return jsdom.window;
}

beforeEach(() => {
  globals.reset();
  setInteractorTimeout(20);
});

afterEach(() => {
  jsdom?.window?.close();
});
