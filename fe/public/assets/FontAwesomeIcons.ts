import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarWeek,
  faChevronLeft,
  faChevronRight,
  faHome,
  faPencil,
  faTimesCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

library.add(faCalendarWeek);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faHome);
library.add(faPencil);
library.add(faTimesCircle);
library.add(faTrash);

export const calendarWeek = icon({ prefix: 'fas', iconName: 'calendar-week' })
  .html[0];
export const chevronLeft = icon({ prefix: 'fas', iconName: 'chevron-left' })
  .html[0];
export const chevronRight = icon({ prefix: 'fas', iconName: 'chevron-right' })
  .html[0];
export const home = icon({ prefix: 'fas', iconName: 'home' }).html[0];
export const pencil = icon({ prefix: 'fas', iconName: 'pencil' }).html[0];
export const times = icon({ prefix: 'fas', iconName: 'times-circle' }).html[0];
export const trash = icon({ prefix: 'fas', iconName: 'trash' }).html[0];
