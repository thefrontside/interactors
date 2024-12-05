import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { JSDOM } from "jsdom";

import { globals, setDocumentResolver, setInteractorTimeout } from "../mod.ts";

function makeDocument(body = ""): Document {
  return new JSDOM(`<!doctype html><html><body>${body}</body></html>`).window
    .document;
}

describe("@interactors/globals", () => {
  beforeEach(() => {
    globals.reset();
    // @ts-ignore Reset jsdom state
    delete globalThis.document;
  });

  describe("document", () => {
    it("`returns the document from document resolver", () => {
      let globalDocument = makeDocument();
      setDocumentResolver(() => globalDocument);
      expect(globals.document).toEqual(globalDocument);
    });
  });

  describe("interactorTimeout", () => {
    it("returns 1900 by default", () => {
      expect(globals.interactorTimeout).toEqual(1900);
    });

    it("returns overridden number", () => {
      setInteractorTimeout(3000);
      expect(globals.interactorTimeout).toEqual(3000);
    });
  });
});
