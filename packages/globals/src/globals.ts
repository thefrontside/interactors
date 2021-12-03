/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardLayout } from "./keyboard-layout";

export type ActionType = "interaction" | "check";

interface Globals {
  readonly document: Document;
  readonly wrapAction: ActionWrapper;
  readonly actionWrappers: Set<ActionWrapper>;
  readonly interactorTimeout: number;
  readonly reset: () => void;
  readonly keyboardLayout: KeyboardLayout;
}

export type InteractorOptions = {
  interactorName: string;
  code: string;
  locator?: string;
  filter?: Record<string, any>;
  ancestors?: InteractorOptions[];
};

export type ActionOptions = {
  interactor: InteractorOptions;
  actionName: string;
  type: ActionType;
  code: string;
  args?: unknown[];
};

export interface ActionEvent<T> {
  description: string;
  action: () => Promise<T>;
  options: ActionOptions;
}

export type ActionWrapper<T = any> = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  eventOrDescription: ActionEvent<T> | String,
  action?: () => Promise<T>,
  type?: ActionType
) => () => Promise<T>;

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
        wrapAction: {
          value: <T>(event: ActionEvent<T>): (() => Promise<T>) => {
            let wrappedAction = event.action;
            for (let wrapper of getGlobals().actionWrappers) {
              wrappedAction = wrapper({ ...event, action: wrappedAction });
            }
            return wrappedAction;
          },
          enumerable: true,
        },
        actionWrappers: {
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

export const globals = getGlobals() as Omit<Globals, "actionWrappers">;

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

export function addActionWrapper<T>(wrapper: ActionWrapper<T>): () => boolean {
  getGlobals().actionWrappers.add(wrapper as any);

  return () => getGlobals().actionWrappers.delete(wrapper as any);
}

export function setKeyboardLayout(layout: KeyboardLayout): void {
  Object.defineProperty(getGlobals(), "keyboardLayout", {
    value: layout,
    enumerable: true,
    configurable: true,
  });
}
