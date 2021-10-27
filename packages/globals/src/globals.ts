/* eslint-disable @typescript-eslint/no-explicit-any */
interface Globals {
  readonly document: Document;
  readonly wrapInteraction: <I>(interaction: I) => I;
  readonly interactionWrappers: Set<<I>(interaction: I) => I>;
  readonly interactorTimeout: number;
  readonly reset: () => void;
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
        wrapInteraction: {
          value: <I>(interaction: I): I => {
            let wrappedInteraction = interaction;
            for (let wrapper of getGlobals().interactionWrappers) {
              wrappedInteraction = wrapper(wrappedInteraction);
            }
            return wrappedInteraction;
          },
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

export const globals = getGlobals() as Omit<Globals, "interactionWrappers">;

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

export function addInteractionWrapper<I extends Record<string, unknown>>(
  wrapper: (interaction: I) => I
): () => boolean {
  getGlobals().interactionWrappers.add(wrapper as any);

  return () => getGlobals().interactionWrappers.delete(wrapper as any);
}
