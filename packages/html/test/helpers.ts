import { beforeEach } from "mocha";
import { DOMWindow, JSDOM } from "jsdom";
import { globals, setDocumentResolver } from "../src/globals";

let jsdom: JSDOM;

export function dom(html: string): DOMWindow {
  jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

  setDocumentResolver(() => jsdom.window.document);

  return jsdom.window;
}

beforeEach(() => {
  globals.reset();
  globals.interactorTimeout = 20;
});

afterEach(() => {
  jsdom?.window?.close();
});
