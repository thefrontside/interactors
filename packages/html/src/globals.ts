import { bigtestGlobals } from "@bigtest/globals";

export type RunnerState = "pending" | "step" | "assertion";

interface Globals {
  document: Document;
  runnerState: RunnerState;
  appUrl?: string;
  interactorTimeout: number;
  testFrame?: HTMLIFrameElement;
  appTimeout: number;
  reset: () => void;
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
        runnerState: {
          get(): RunnerState {
            return bigtestGlobals.runnerState || "pending";
          },
          set(state: RunnerState) {
            bigtestGlobals.runnerState = state;
          },
          enumerable: true,
        },
        appUrl: {
          get(): string | undefined {
            return bigtestGlobals.appUrl;
          },
          set(url: string | undefined) {
            bigtestGlobals.appUrl = url;
          },
          enumerable: true,
        },
        interactorTimeout: {
          get(): number {
            return bigtestGlobals.defaultInteractorTimeout;
          },
          set(timeout: number) {
            bigtestGlobals.defaultInteractorTimeout = timeout;
          },
          enumerable: true,
        },
        testFrame: {
          get(): HTMLIFrameElement | undefined {
            return bigtestGlobals.testFrame;
          },
          set(frame: HTMLIFrameElement | undefined) {
            bigtestGlobals.testFrame = frame;
          },
          enumerable: true,
        },
        appTimeout: {
          get(): number {
            return bigtestGlobals.defaultAppTimeout;
          },
          set(timeout: number) {
            bigtestGlobals.defaultAppTimeout = timeout;
          },
          enumerable: true,
        },
        reset: {
          value() {
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
