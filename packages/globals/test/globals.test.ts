import { describe, it } from "mocha";
import expect from "expect";
import { JSDOM } from "jsdom";

import { globals, setDocumentResolver, addActionWrapper, setInteractorTimeout } from "../src";

function makeDocument(body = ""): Document {
  return new JSDOM(`<!doctype html><html><body>${body}</body></html>`).window.document;
}

describe("@interactors/globals", () => {
  beforeEach(() => {
    globals.reset();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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

  describe("wrapInteraction", () => {
    it("returns the same interaction without any change", () => {
      let action = async () => {};
      expect(globals.wrapAction("plain action", action, "interaction")).toBe(action);
    });

    it("applies defined interaction wrapper", async () => {
      let action = async () => "foo";
      let removeWrapper = addActionWrapper(() => async () => "bar");
      let wrappedAction = globals.wrapAction("foo action", action, "interaction");

      removeWrapper();

      expect(await wrappedAction()).toEqual("bar");
    });
  });
});