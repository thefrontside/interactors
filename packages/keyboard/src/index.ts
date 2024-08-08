import { setKeyboardLayout } from '@interactors/globals';
export { type KeyOptions, Keyboard } from './keyboard.ts';
export { createKeyboardLayout, US_INTERNATIONAL } from './layout.ts';
export { fillIn } from './fill-in.ts';

import { US_INTERNATIONAL } from './layout.ts';

setKeyboardLayout(US_INTERNATIONAL);
