export { KeyOptions, Keyboard } from './keyboard';
export { createKeyboardLayout, US_INTERNATIONAL } from './layout';
export { fillIn } from './fill-in';

import { setKeyboardLayout } from '@interactors/globals';
import { US_INTERNATIONAL } from './layout';

setKeyboardLayout(US_INTERNATIONAL);
