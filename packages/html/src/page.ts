import { createInteractor } from './create-interactor';

const PageInteractor = createInteractor('page')({
  selector: ':root',
  filters: {
    title: (element) => element.ownerDocument.title,
    url: (element) => {
      let url = new URL(element.ownerDocument.location.href);
      let search = new URLSearchParams(element.ownerDocument.location.search);
      search.delete('bigtest-interactor-page-number');
      url.search = search.toString();
      return url.toString();
    },
  },
});

/**
 * This {@link Interactor} can be used to assert on global properties of the
 * page. When using the BigTest test runner, it can also be used for
 * interacting with the page itself, for example through nagivation.
 *
 * ### Example
 *
 * ``` typescript
 * await Page.has({ title: 'Welcome to my app!' });
 * ```
 *
 * Navigation, for BigTest test runner only:
 *
 * ``` typescript
 * await Page.visit('/archive');
 * ```
 *
 * ### Filters
 *
 * - `title`: *string* – the title of the document
 * - `url`: *string* – the URL of the document
 *
 * ### Actions
 *
 * - `visit(path: string)`: *{@link Interaction}* – visit the given path in the test frame, BigTest runner only.
 *
 * @category Interactor
 */
export const Page = PageInteractor;
