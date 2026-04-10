---
id: configuration
title: "Configuration"
---

There are a few options for adapting interactors to your needs.

## Timeout

Like we've seen, interactors wait for a set amount of time until they either
succceed, or the timeout is increased. The default timeout is 1900ms. You can
change this timeout like this:

```js
import { setInteractorTimeout } from '@interactors/html';

setInteractorTimeout(5000) // increase to five seconds
```

## Document

Interactors operate on a document, normally this is the global document which
is exposed via the `window.document` global property. However in some cases,
you might want to use a different document. For example you might want to use
the document object of another frame, or the document property of a [jsdom][]
environment. If you need to change the document, you can use
`setDocumentResolver` like this:

```js
import { setDocumentResolver } from '@interactors/html';
import { JSDOM } from "jsdom";

let jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });

setDocumentResolver(() => jsdom.window.document);
```

## Wrappers

Interactors provide an introspection API, which allows you to wrap
instrumentation around your actions and assertions. You can use it like this:

```js
import { wrapAction } from '@interactors/html';

wrapAction(async (description, action, type) => {
  let startTime = performance.now();
  await action;
  console.log(`${type} ${description} took ${performance.now() - startTime)}ms`);
});
```

[jsdom]: https://github.com/jsdom/jsdom
