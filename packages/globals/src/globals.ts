/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Operation } from '@effection/core';
import { KeyboardLayout } from './keyboard-layout';

type InteractionType = "action" | "assertion";

interface Interaction {
  type: InteractionType;
  description: string;
  interactor: unknown; // we can't type this any better here
}

export type InteractionWrapper = <R>(interaction: Interaction, inner: Operation<R>) => Operation<R>

interface Globals {
  readonly document: Document;
  readonly interactionWrappers: Set<InteractionWrapper>;
  readonly interactorTimeout: number;
  readonly reset: () => void;
  readonly keyboardLayout: KeyboardLayout
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/prefer-namespace-keyword
  module globalThis {
    // eslint-disable-next-line prefer-let/prefer-let, no-var
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
        interactionWrappers: {
          value: new Set(),
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

export const globals = getGlobals();

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

export function addInteractionWrapper(wrapper: InteractionWrapper): () => boolean {
  getGlobals().interactionWrappers.add(wrapper);
  return () => getGlobals().interactionWrappers.delete(wrapper);
}

export function setKeyboardLayout(layout: KeyboardLayout): void {
  Object.defineProperty(getGlobals(), "keyboardLayout", {
    value: layout,
    enumerable: true,
    configurable: true,
  });
}

