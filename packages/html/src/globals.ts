import { bigtestGlobals } from "@bigtest/globals";

interface Globals {
  documentResolver: () => Document;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/prefer-namespace-keyword
  module globalThis {
    // eslint-disable-next-line prefer-let/prefer-let, no-var
    var __interactors: Globals;
  }
}

if (!globalThis.__interactors) {
  globalThis.__interactors = {
    // TODO Replace it to use `globalThis.document` after we start using `setDocumentResolver` in bigtest
    documentResolver: () => bigtestGlobals.document,
  };
}

export const globals = {
  get document(): Document {
    return globalThis.__interactors.documentResolver();
  },
};

export function setDocumentResolver(resolver: () => Document): void {
  globalThis.__interactors.documentResolver = resolver;
}
