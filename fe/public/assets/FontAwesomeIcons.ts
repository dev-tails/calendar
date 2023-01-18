import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight,
  faHome,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faHome);
library.add(faTimesCircle);

export const chevronLeft = icon({ prefix: 'fas', iconName: 'chevron-left' })
  .html[0];
export const chevronRight = icon({ prefix: 'fas', iconName: 'chevron-right' })
  .html[0];
export const home = icon({ prefix: 'fas', iconName: 'home' }).html[0];
export const times = icon({ prefix: 'fas', iconName: 'times-circle' }).html[0];
