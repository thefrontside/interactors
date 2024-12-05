/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Operation } from "@effection/core";
import type { KeyboardLayout } from "./keyboard-layout.ts";

export type InteractionType = "action" | "assertion";

type Interaction<T = any> = Operation<T> & {
  type: InteractionType;
  description: string;
  options: InteractionOptions;
  interactor: unknown; // we can't type this any better here
  code: () => string;
  halt: () => Promise<void>;
};

interface Globals {
  readonly document: Document;
  readonly interactorTimeout: number;
  readonly reset: () => void;
  readonly keyboardLayout: KeyboardLayout;
}

export type InteractorOptions = {
  interactor: string;
  code: () => string;
  locator?: string;
  filter?: Record<string, unknown>;
};

export type InteractionOptions = InteractorOptions & {
  name: string;
  type: InteractionType;
  code: () => string;
  args: unknown[];
  ancestors?: InteractorOptions[];
};

export type InteractionWrapper<T = any> = (perform: () => Promise<T>, interaction: Interaction<T>) => Operation<T>;

declare global {
  // deno-lint-ignore prefer-namespace-keyword
  module globalThis {
    // deno-lint-ignore no-var
    var __interactors: Globals;
  }
}

if (!globalThis.__interactors) {
  Object.defineProperty(globalThis, "__interactors", {
    value: Object.defineProperties(
      {},
      {
        document: {
          get: () => globalThis.document,
          enumerable: true,
          configurable: true,
        },
        keyboardLayout: {
          get: () => undefined,
          enumerable: true,
          configurable: true,
        },
        interactorTimeout: {
          value: 1900,
          enumerable: true,
          configurable: true,
        },
        reset: {
          value() {
            setDocumentResolver(() => globalThis.document);
            setInteractorTimeout(1900);
          },
          enumerable: true,
        },
      }
    ),
  });
}

const getGlobals = () => globalThis.__interactors as Globals;

export const globals: Globals = getGlobals();

export function setDocumentResolver(resolver: () => Document): void {
  Object.defineProperty(getGlobals(), "document", {
    get: resolver,
    enumerable: true,
    configurable: true,
  });
}

export function setInteractorTimeout(ms: number): void {
  Object.defineProperty(getGlobals(), "interactorTimeout", {
    value: ms,
    enumerable: true,
    configurable: true,
  });
}

export function setKeyboardLayout(layout: KeyboardLayout): void {
  Object.defineProperty(getGlobals(), "keyboardLayout", {
    value: layout,
    enumerable: true,
    configurable: true,
  });
}
