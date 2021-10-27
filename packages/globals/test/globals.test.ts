import { describe, it } from "mocha";
import expect from "expect";
import { JSDOM } from "jsdom";

import { globals, setDocumentResolver, addInteractionWrapper, setInteractorTimeout } from "../src";

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
      let interaction = Promise.resolve();
      expect(globals.wrapInteraction(interaction)).toBe(interaction);
    });

    it("applies defined interaction wrapper", () => {
      let interaction = { description: "foo", then: () => null };
      let removeWrapper = addInteractionWrapper((i: typeof interaction) => {
        i.description = "bar";
        return i;
      });
      let wrappedInteraction = globals.wrapInteraction(interaction);

      removeWrapper();

      expect(wrappedInteraction).toEqual({ ...interaction, description: "bar" });
    });
  });
});
