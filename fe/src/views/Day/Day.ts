import { Div } from '../../components/elements/Div';
import { Header } from '../../components/elements//Header';
import { Span } from '../../components/elements//Span';
import { mettingsObject } from '../../fakeData/fakeData';
import {
  formatDateTime,
  dateOptions,
  timeOptions,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { onClick, setStyle } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import { flexAlignItemsCenter } from '../../utils/styles';
import { Button } from '../../components/elements/Button';
import { getEventsForDay } from '../../apis/EventApi';

export function Day(date?: string) {
  let today = date ? new Date(date) : new Date();
  const el = Div();
  const datesHeader = Div({
    styles: {
      ...flexAlignItemsCenter,
      justifyContent: 'space-between',
      margin: '12px 20px',
    },
  });

  const title = Header({
    text: new Intl.DateTimeFormat('en-US', dateOptions as any).format(
      new Date(today)
    ),
    headerType: 'h1',
  });
  setStyle(title, {
    padding: '12px',
    margin: '12px 20px',
  });

  const prevDay = Button({
    attr: {
      textContent: 'prev',
      onclick: () => goToSelectedDayView(today, 'previous'),
    },
  });

  const nextDay = Button({
    attr: {
      textContent: 'next',
      onclick: () => goToSelectedDayView(today, 'next'),
    },
  });

  datesHeader.appendChild(prevDay);
  datesHeader.appendChild(title);
  datesHeader.appendChild(nextDay);
  el.appendChild(datesHeader);

  const meetingsList = Div();

  // move this to API?

  const init = async () => {
    const events = await getEventsForDay(today);
    return events;
  };
  init();

  const todaysEvents = mettingsObject.filter((meeting) => {
    const eventDate = new Date(meeting.start);
    const inputDate = eventDate.toISOString().split('T')[0];
    const todaysDate = new Date(today).toISOString().split('T')[0];
    return inputDate == todaysDate;
  });

  if (todaysEvents.length) {
    todaysEvents.sort(
      (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
    );

    todaysEvents.forEach((meeting) => {
      if (meeting.allDay) {
        const allDayEventStyles = {
          borderRadius: '4px',
          padding: '12px',
          margin: '12px 20px',
          width: 'auto',
          backgroundColor: 'papayawhip',
          cursor: 'pointer',
        };
        const allDayEvents = createEventCard(meeting, allDayEventStyles, () =>
          goToEventPage(meeting.id)
        );

        el.appendChild(allDayEvents);
      }

      if (meeting.start && meeting.end) {
        const meetingContainer = Div({
          styles: {
            borderRadius: '4px',
            margin: '12px 20px',
            gridGap: '20px',
            ...flexAlignItemsCenter,
          },
        });

        const times = Div({
          styles: {
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: 'auto',
            maxWidth: '160px',
            width: '100%',
          },
        });

        const start = Span();
        start.innerText = `${formatDateTime(
          'en-CA',
          timeOptions,
          meeting.start
        )} - `;
        times.appendChild(start);

        const end = Span();
        end.innerText = ` ${formatDateTime('en-CA', timeOptions, meeting.end)}`;
        times.appendChild(end);

        meetingContainer.appendChild(times);
        const eventStyles = {
          borderRadius: '4px',
          padding: '12px',
          width: '100%',
          backgroundColor: '#d2e7de',
          cursor: 'pointer',
        };
        const event = createEventCard(meeting, eventStyles, () =>
          goToEventPage(meeting.id)
        );

        meetingContainer.appendChild(event);
        meetingsList.appendChild(meetingContainer);
      }
    });
    // if no events show no events

    el.appendChild(meetingsList);
  } else {
    const noEventsLabel = Div({
      attr: { innerText: 'No events today' },
      styles: { margin: '12px 20px' },
    });
    el.appendChild(noEventsLabel);
  }
  return el;
}

function createEventCard(
  meeting: IEvent,
  styles: Partial<CSSStyleDeclaration>,
  callback: () => void
) {
  const event = Div({ styles });

  const title = Header({ text: meeting.title, headerType: 'h3' });
  event.appendChild(title);

  if (meeting.description) {
    const description = Div({ attr: { innerText: meeting.description } });
    event.appendChild(description);
  }

  onClick(event, callback);

  return event;
}

function goToEventPage(eventId: string) {
  setURL(`/events/${eventId}`);
}

function goToSelectedDayView(
  currentDayView: Date,
  direction: 'previous' | 'next'
) {
  const moveDay =
    direction === 'previous'
      ? currentDayView.getDate() - 1
      : currentDayView.getDate() + 1;
  const previousDay = currentDayView.setDate(moveDay);
  currentDayView = new Date(previousDay);
  const dateString = formatSplitDate(currentDayView, '/', 'yyyy-mm-dd');
  setURL(`/day/${dateString}`);
}
