import { beforeEach, describe, it } from '@std/testing/bdd';
import { expect } from "@std/expect";
import { JSDOM } from "jsdom";
import { Symbol } from "@effection/core";

import { globals, setDocumentResolver, addInteractionWrapper, setInteractorTimeout } from "../mod.ts";

function makeDocument(body = ""): Document {
  return new JSDOM(`<!doctype html><html><body>${body}</body></html>`).window.document;
}

describe("@interactors/globals", () => {
  beforeEach(() => {
    globals.reset();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  describe("wrapInteraction", () => {
    it("returns the same interaction without any change", () => {
      let action = async () => {};
      expect(
        (globals.wrapInteraction(
          action,
          {
            type: "action",
            interactor: "Interactor",
            description: "plain action",
            action,
            code: () => "",
            halt: () => Promise.resolve(),
            options: {
              interactor: "Interactor",
              name: "plain",
              type: "action",
              code: () => "",
              args: [],
            },
            [Symbol.operation]: Promise.resolve(),
          }
        ) as () => unknown)()
      ).toBe(action);
    });

    it("applies defined interaction wrapper", () => {
      let action = async () => await Promise.resolve("foo");
      let removeWrapper = addInteractionWrapper(() => async () => await Promise.resolve("bar"));
      globals.wrapInteraction(
        action,
        {
          type: "action",
          interactor: "Interactor",
          description: "foo action",
          action,
          code: () => "",
          halt: () => Promise.resolve(),
          options: {
            interactor: "Interactor",
            name: "foo",
            type: "action",
            code: () => "",
            args: [],
          },
          [Symbol.operation]: Promise.resolve(),
        },
      );

      removeWrapper();
      expect(globals.interactionWrappers.has(action)).toEqual(false);
    });
  });
});
