import { Div } from '../components/elements/Div';
import { getEventById } from '../apis/EventApi';
import {
  convertMidnightUTCToLocalDay,
  formatSplitDate,
} from '../utils/dateHelpers';
import { setURL } from '../utils/HistoryUtils';
import { AddEvent } from './AddEvent/AddEvent';
import { Day } from './Day/Day';
import { EditEvent } from './EditEvent/EditEvent';
import { Event } from './Event/Event';
import { Header } from './Header/Header';

export function Router() {
  const router = Div();

  function init() {
    handleRouteUpdated();
  }

  window.addEventListener('popstate', handleRouteUpdated);

  async function handleRouteUpdated() {
    router.innerHTML = '';

    const path = window.location.pathname;
    const home = path === '/';
    const addNewEventPath = path === '/new';
    const isDayPath = path.includes('day');
    const eventsPaths = !home && !addNewEventPath && !isDayPath;

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
          router.append(EditEvent(eventObject));
        }
        break;
      case `/new`:
        router.append(Header('new'));
        router.append(AddEvent());
        break;
      default:
        break;
    }
  }

  init();

  return router;
}
