import { Div } from '../components/elements';
import { getEventById } from '../apis/EventApi';
import {
  convertMidnightUTCToLocalDay,
  formatSplitDate,
  getDateStringFromUrl,
} from '../utils/dateHelpers';
import { setURL } from '../utils/HistoryUtils';
import { Day } from './Day/Day';
import { EventForm } from './Event/EventForm';
import { Event } from './Event/Event';
import { Header } from './Header/Header';
import { LogIn } from './LogIn/LogIn';
import { DayGrid } from './Day/DayGrid.ts/DayGrid';

export function Router(authenticated: boolean) {
  const router = Div({
    selectors: { id: 'router' },
  });

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
    const addEventPath = path.includes('add');
    const isDayPath = path.includes('day');
    const isDayGridPath = path.includes('grid');
    const eventsPaths = !home && !addEventPath && !isDayPath && !isDayGridPath;

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
    if (isDayPath || addEventPath) {
      eventsDate = getDateStringFromUrl();
    }

    switch (path) {
      case '/':
        router.append(Header('home'));
        router.append(Day());
        break;
      case `/day/${eventsDate}`:
        router.append(Header('day'));
        router.append(Day(eventsDate));
        break;
      case `/grid`:
        router.append(Header('day'));
        router.append(DayGrid());
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
          router.append(EventForm(eventObject));
        }
        break;
      case `/add`:
      case `/add/${eventsDate}`:
        router.append(Header('add'));
        router.append(EventForm());
        break;
      default:
        break;
    }
  }

  init();

  return router;
}
