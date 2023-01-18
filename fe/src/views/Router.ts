import { Div } from '../components/elements/Div';
import { getEventById } from '../apis/EventApi';
import {
  convertMidnightUTCToLocalDay,
  formatSplitDate,
} from '../utils/dateHelpers';
import { setURL } from '../utils/HistoryUtils';
import { Day } from './Day/Day';
import { EventForm } from './Event/EventForm';
import { Event } from './Event/Event';
import { Header } from './Header/Header';
import { LogIn } from './LogIn/LogIn';

export function Router(authenticated: boolean, self: User) {
  const router = Div({ styles: { height: '100%' } });

  function init() {
    handleRouteUpdated();
  }

  window.addEventListener('popstate', handleRouteUpdated);

  async function handleRouteUpdated() {
    router.innerHTML = '';

    if (!authenticated) {
      return router.append(LogIn());
    }

    const path = window.location.pathname;
    const home = path === '/';
    const addEventPath = path === '/add';
    const isDayPath = path.includes('day');
    const eventsPaths = !home && !addEventPath && !isDayPath;

    let eventObject: IEvent | undefined;
    if (eventsPaths) {
      const eventPath = path.split('/');
      const eventId = eventPath[eventPath.length - 1]?.toString();
      eventObject = await getEventById(eventId);
      if (!eventObject) {
        setURL('/');
      }
    }

    let eventsDate = new Date().toDateString();
    if (isDayPath) {
      const splitDate = path.split('/');
      const fullYear = splitDate[2];
      const month = splitDate[3];
      const day = splitDate[4];
      eventsDate = `/day/${fullYear}/${month}/${day}`;
    }

    switch (path) {
      case '/':
        router.append(Header('home'));
        router.append(Day());
        break;
      case eventsDate:
        router.append(Header('day'));
        router.append(Day(eventsDate));
        break;
      case `/events/${eventObject?._id}`:
        if (eventObject) {
          const allDayDate = convertMidnightUTCToLocalDay(eventObject.start);
          const date = eventObject.allDay ? allDayDate : eventObject.start;
          const dateURL = formatSplitDate(date, '/', 'yyyy-mm-dd');

          router.append(Header('event', dateURL));
          router.append(Event(eventObject));
        }

        break;
      case `/events/edit/${eventObject?._id}`:
        if (eventObject) {
          router.append(Header('edit'));
          router.append(EventForm(eventObject, self?._id));
        }
        break;
      case `/add`:
        let eventTemplate: IEvent = {
          title: '',
          description: '',
          start: new Date(),
          allDay: false,
          // users: self._id ? [self._id] : [],
        };
        router.append(Header('add'));
        router.append(EventForm(eventTemplate, self?._id));
        break;
      default:
        break;
    }
  }

  init();

  return router;
}
