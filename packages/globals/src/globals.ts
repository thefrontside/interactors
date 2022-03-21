/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Operation } from "@effection/core";
import { KeyboardLayout } from "./keyboard-layout";

export type InteractionType = "action" | "assertion";

type Interaction<T = any> = Operation<T> & {
  type: InteractionType;
  description: string;
  options: InteractionOptions;
  interactor: unknown; // we can't type this any better here
  code: () => string;
  catchHalt: () => void;
  halt: () => void;
};

interface Globals {
  readonly document: Document;
  /**
   * @deprecated Use `wrapInteraction` instead
   */
  readonly wrapAction: <T>(description: string, perform: () => Promise<T>, type: InteractionType) => Operation<T>;
  readonly wrapInteraction: InteractionWrapper;
  readonly interactionWrappers: Set<InteractionWrapper>;
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
  args?: unknown[];
  ancestors?: InteractorOptions[];
};

export type InteractionWrapper<T = any> = (perform: () => Promise<T>, interaction: Interaction<T>) => Operation<T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/prefer-namespace-keyword
  module globalThis {
    // eslint-disable-next-line prefer-let/prefer-let, no-var
    var __interactors: Globals;
  }
}

if (!globalThis.__interactors) {
  let wrapInteraction = <T>(perform: () => Promise<T>, interaction: Interaction<T>): Operation<T> => {
    return (scope) => {
      let current = perform;
      for (let wrapper of getGlobals().interactionWrappers) {
        let operation = wrapper(current, interaction);
        current = () => scope.run(operation);
      }
      return current;
    };
  };
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
        wrapAction: {
          value: wrapInteraction,
          enumerable: true,
        },
        wrapInteraction: {
          value: wrapInteraction,
          enumerable: true,
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

/**
 * @deprecated Use `addInteractionWrapper` instead
 */
export function addActionWrapper<T>(
  wrapper: (description: string, perform: () => Promise<T>, type: InteractionType) => Operation<T>
): () => boolean {
  return addInteractionWrapper(
    (perform: () => Promise<T>, interaction: Interaction<T>): Operation<T> =>
      wrapper(interaction.description, perform, interaction.type)
  );
}

export function addInteractionWrapper<T>(wrapper: InteractionWrapper<T>): () => boolean {
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
