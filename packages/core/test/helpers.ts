import { type DOMWindow, JSDOM } from "jsdom";
import { afterEach, beforeEach } from "./deps.ts";
import { addInteractionWrapper, globals, setDocumentResolver, setInteractorTimeout } from "@interactors/globals";

let jsdom: JSDOM;
let removeWrapper: () => void;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);
  removeWrapper = addInteractionWrapper(async (perform) => await perform());

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
