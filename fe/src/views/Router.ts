import { getEventById } from '../apis/EventApi';
import { Div } from '../components/elements/Div';
import {
  converToCurrentTZMidnight,
  formatSplitDate,
} from '../utils/dateHelpers';
import { setStyle } from '../utils/DOMutils';
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
    const isHome = path === '/';
    const addNewEventPath = path === '/new';
    const isDay = path.includes('day');
    const eventsPath = path.includes('events');
    let eventObject: IEvent | undefined;
    let eventsDate = new Date().toDateString();

    if (!isHome && !addNewEventPath && !isDay) {
      const pathSplit = path.split('/');
      const eventId = pathSplit[pathSplit.length - 1]?.toString();
      eventObject = await getEventById(eventId);
      if (!eventObject) {
        setURL('/');
      }
    }

    if (isDay) {
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
        if (eventObject?.start) {
          const date = converToCurrentTZMidnight(eventObject.start);
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
