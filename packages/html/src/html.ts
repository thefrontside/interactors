import { click, createInteractor } from '@interactors/core';
import { isVisible } from 'element-is-visible';

const HTMLInteractor = createInteractor<HTMLElement>('element')
  .selector('*')
  .locator(innerText)
  .filters({
    text: innerText,
    title: (element) => element.title,
    id: (element) => element.id,
    visible: { apply: isVisible, default: true },
    className: (element) => Array.from(element.classList).join(' '),
    classList: (element) => Array.from(element.classList),
    focused: (element) => element.ownerDocument.activeElement === element
  })
  .actions({
    click: ({ perform }, init?: MouseEventInit) => perform((element) => { click(element, init); }),
    focus: ({ perform }) => perform((element) => { element.focus(); }),
    blur: ({ perform }) => perform((element) => { element.blur(); }),
  })

// Because JSDOM does not have any concept of flow or layout, it cannot actually implement
// `innerText` correctly, so they have opted not to implement it at all. So, to make things
// work use `textContent` as a backup for all `HTMLElement` subtypes if `innerText` is
// undefined
//
// See details: https://github.com/jsdom/jsdom/issues/1245
export function innerText(element?: HTMLElement | null): string {
  return (element?.innerText != null ? element?.innerText :  element?.textContent) || '';
}

/**
 * Use this {@link InteractorConstructor} as a base for creating interactors which
 * work with HTML elements. This provides some basic functionality which is convenient
 * for most HTML elements.
 *
 * ### Example
 *
 * ``` typescript
 * const Link = HTML.extend<HTMLLinkElement>('link')
 *   .selector('a[href]')
 *   .filters({
 *     href: (element) => element.href
 *   })
 * ```
 *
 * ### Filters
 *
 * - `classList`: *string[]* — Filter by the list of classes found in element's `className`
 * - `className`: *string* — Filter by element's `className`
 * - `title`: *string* – Filter by title
 * - `id`: *string* – Filter by id
 * - `text`: *string* –  Filter by the text content of this element.
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `focused`: *boolean* – Filter by whether the element is focused. See {@link focused}.
 *
 * ### Actions
 *
 * - `click()`: *{@link Interaction}* – Click on the element
 * - `focus()`: *{@link Interaction}* – Move focus to the element
 * - `blur()`: *{@link Interaction}* – Move focus away from the element
 *
 * @category Interactor
 */
export const HTML = HTMLInteractor;
