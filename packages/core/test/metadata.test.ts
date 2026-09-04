import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import {
  and,
  createInteractor,
  createMatcher,
  getInteractorConstructorMetadata,
  getMatcherConstructorMetadata,
  isInteractorConstructor,
  isMatcherConstructor,
  matching,
} from "../mod.ts";

describe("constructor metadata", () => {
  it("describes the cumulative filters and actions on an interactor", () => {
    let FormField = createInteractor("form field")
      .actions({
        focus: () => Promise.resolve(),
      })
      .filters({
        value: (element) => element.textContent,
      })
      .actions({
        clear: () => Promise.resolve(),
      });

    expect(getInteractorConstructorMetadata(FormField)).toEqual({
      kind: "interactor",
      version: 1,
      name: "form field",
      actions: ["clear", "focus"],
      filters: ["value"],
    });
    expect(isInteractorConstructor(FormField)).toBe(true);
  });

  it("does not mistake a structurally similar function for an interactor", () => {
    let similar = Object.assign(() => undefined, {
      interactorName: "not an interactor",
      actions: ["click"],
      filters: ["title"],
    });

    expect(isInteractorConstructor(similar)).toBe(false);
    expect(getInteractorConstructorMetadata(similar)).toBeUndefined();
  });

  it("brands built-in and custom matcher constructors", () => {
    let custom = createMatcher("custom", (expected: string) => ({
      match: (actual: string) => actual === expected,
      description: () => `equal to ${expected}`,
    }));

    expect(getMatcherConstructorMetadata(matching)).toEqual({
      kind: "matcher",
      version: 1,
      name: "matching",
    });
    expect(getMatcherConstructorMetadata(and)).toEqual({
      kind: "matcher",
      version: 1,
      name: "and",
    });
    expect(getMatcherConstructorMetadata(custom)).toEqual({
      kind: "matcher",
      version: 1,
      name: "custom",
    });
    expect(isMatcherConstructor(custom)).toBe(true);
    expect(isMatcherConstructor(() => undefined)).toBe(false);
  });
});
