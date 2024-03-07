import { afterEach, beforeEach } from "node:test";
import { DOMWindow, JSDOM } from "jsdom";
import { addInteractionWrapper, globals, setDocumentResolver, setInteractorTimeout } from "@interactors/globals";

let jsdom: JSDOM;
let removeWrapper: () => void;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);
  removeWrapper = addInteractionWrapper(async (perform) => perform());

  return jsdom.window;
}

beforeEach(() => {
  globals.reset();
  setInteractorTimeout(20);
});

afterEach(() => {
  removeWrapper?.();
  jsdom?.window?.close();
});
