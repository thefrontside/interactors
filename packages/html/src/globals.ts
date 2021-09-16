interface InteractorOptions {
  getDocument: Document;
  defaultTimeout?: number;
  readOnlyMode: boolean;
}

function options(): InteractorOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let global = globalThis as any;

  if(!global.__interactorOptions) {
    global.__interactorOptions = {
      getDocument: () => globalThis.document,
      defaultTimeout: 10,
      readOnlyMode: false
    };
  }
  return global.__interactorOptions as InteractorOptions;
}

export const globals = {
  getDocument(): Document {
    let doc = globalThis.document;
    if(!doc) { throw new Error('no document found') };
    return doc;
  },

  get defaultTimeout(): number {
    return options().defaultTimeout;
  },

  get readOnlyMode(): boolean {
    return options().readOnlyMode;
  }
}

export function setDefaultTimeout(timeout: number): void {
  options().defaultTimeout = timeout;
};

export function setDocument(fn: () => Document): void {
  options().getDocument = fn;
}