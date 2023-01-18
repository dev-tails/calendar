import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faHome);

export const chevronLeft = icon({ prefix: 'fas', iconName: 'chevron-left' })
  .html[0];
export const chevronRight = icon({ prefix: 'fas', iconName: 'chevron-right' })
  .html[0];
export const home = icon({ prefix: 'fas', iconName: 'home' }).html[0];
