import { createInteractor, perform } from '../index';
import { isVisible } from 'element-is-visible';

export const Link = createInteractor<HTMLLinkElement>('link')({
  selector: 'a[href]',
  locators: {
    byId: (element) => element.id,
    byTitle: (element) => element.title,
  },
  filters: {
    title: (element) => element.title,
    href: (element) => element.href,
    id: (element) => element.id,
    visible: { apply: isVisible, default: true },
  },
  actions: {
    click: perform((element) => { element.click(); })
  },
});
