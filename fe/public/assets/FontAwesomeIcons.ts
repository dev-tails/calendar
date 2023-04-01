import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faCalendarWeek,
  faChevronLeft,
  faChevronRight,
  faClock,
  faEnvelope,
  faEye,
  faHome,
  faHourglassEnd,
  faHourglassStart,
  faLink,
  faPencil,
  faTimesCircle,
  faTrash,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

library.add(faCalendarWeek);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faClock);
library.add(faEnvelope);
library.add(faEye);
library.add(faHome);
library.add(faHourglassEnd);
library.add(faHourglassStart);
library.add(faLink);
library.add(faPencil);
library.add(faTimesCircle);
library.add(faTrash);
library.add(faUsers);

export const calendarWeek = icon({ prefix: 'fas', iconName: 'calendar-week' })
  .html[0];
export const chevronLeft = icon({ prefix: 'fas', iconName: 'chevron-left' })
  .html[0];
export const chevronRight = icon({ prefix: 'fas', iconName: 'chevron-right' })
  .html[0];
export const clockIcon = icon({ prefix: 'fas', iconName: 'clock' }).html[0];
export const envelopIcon = icon({ prefix: 'fas', iconName: 'envelope' })
  .html[0];
export const eyeIcon = icon({ prefix: 'fas', iconName: 'eye' }).html[0];
export const home = icon({ prefix: 'fas', iconName: 'home' }).html[0];
export const hourglassEnd = icon({ prefix: 'fas', iconName: 'hourglass-end' })
  .html[0];
export const hourglassStart = icon({
  prefix: 'fas',
  iconName: 'hourglass-start',
}).html[0];
export const link = icon({ prefix: 'fas', iconName: 'link' }).html[0];
export const pencil = icon({ prefix: 'fas', iconName: 'pencil' }).html[0];
export const times = icon({ prefix: 'fas', iconName: 'times-circle' }).html[0];
export const trash = icon({ prefix: 'fas', iconName: 'trash' }).html[0];
export const usersIcon = icon({ prefix: 'fas', iconName: 'users' }).html[0];
