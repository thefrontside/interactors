import { describe, it } from "mocha";
import expect from "expect";
import { JSDOM } from "jsdom";
import { Symbol as SymbolOperation } from "@effection/core";

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
      let action = async () => {};
      expect(
        globals.wrapInteraction(
          {
            type: "action",
            interactor: "Interactor",
            description: "plain action",
            action,
            options: {
              interactor: "Interactor",
              name: "plain",
              type: "action",
              code: () => "",
            },
            [SymbolOperation.operation]: Promise.resolve(),
          },
          action
        )
      ).toBe(action);
    });

    it("applies defined interaction wrapper", async () => {
      let action = async () => "foo";
      let removeWrapper = addInteractionWrapper(() => async () => "bar");
      globals.wrapInteraction(
        {
          type: "action",
          interactor: "Interactor",
          description: "foo action",
          action,
          options: {
            interactor: "Interactor",
            name: "foo",
            type: "action",
            code: () => "",
          },
          [SymbolOperation.operation]: Promise.resolve(),
        },
        action
      );

      removeWrapper();
      expect(globals.interactionWrappers.has(action)).toEqual(false);
    });
  });
});
