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
          get: () => globalThis.document,
          enumerable: true,
          configurable: true,
        },
        wrapInteraction: {
          value: <Interaction>(interaction: Interaction): Interaction => interaction,
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
            setInteractionWrapper((interaction) => interaction);
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
  Object.defineProperty(globalThis.__interactors, "interactorTimeout", {
    value: ms,
    enumerable: true,
    configurable: true,
  });
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
