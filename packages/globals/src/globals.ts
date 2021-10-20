import { bigtestGlobals } from "@bigtest/globals";

interface Globals {
  readonly document: Document;
  readonly wrapInteraction: <Interaction>(interaction: Interaction) => Interaction;
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
          get() {
            // TODO Replace it to use `globalThis.document` after we start using `setDocumentResolver` in bigtest
            return bigtestGlobals.document;
          },
          enumerable: true,
          configurable: true,
        },
        wrapInteraction: {
          value: <Interaction>(interaction: Interaction): Interaction => interaction,
          enumerable: true,
          configurable: true,
        },
        interactorTimeout: {
          get(): number {
            return bigtestGlobals.defaultInteractorTimeout;
          },
          enumerable: true,
        },
        reset: {
          value() {
            setDocumentResolver(() => bigtestGlobals.document);
            setInteractionWrapper((interaction) => interaction);
            bigtestGlobals.reset();
          },
          enumerable: true,
        },
      }
    ),
  });
}

export const globals = globalThis.__interactors;

export function setDocumentResolver(resolver: () => Document): void {
  Object.defineProperty(globalThis.__interactors, "document", {
    get: resolver,
    enumerable: true,
    configurable: true,
  });
}

export function setInteractorTimeout(ms: number): void {
  bigtestGlobals.defaultInteractorTimeout = ms;
}

export function setInteractionWrapper<Interaction extends Record<string, unknown>>(
  wrapper: (interaction: Interaction) => Interaction
): void {
  Object.defineProperty(globalThis.__interactors, "wrapInteraction", {
    value: wrapper,
    enumerable: true,
    configurable: true,
  });
}
