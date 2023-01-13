import { getEventsForDay } from '../../apis/EventApi';
import {
  formatDateTime,
  dateOptions,
  timeOptions,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { onClick, setStyle } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import { flexAlignItemsCenter } from '../../utils/styles';
import { Div } from '../../components/elements/Div';
import { Span } from '../../components/elements/Span';
import { Button } from '../../components/elements/Button';
import { H1 } from '../../components/elements/H1';
import { H3 } from '../../components/elements/H3';

export function Day(date?: string) {
  let dayView = date ? new Date(date) : new Date();
  const el = Div();

  async function init() {
    const headerDate = Div({
      styles: {
        ...flexAlignItemsCenter,
        justifyContent: 'space-between',
        margin: '12px 20px',
      },
    });

    const title = H1({
      attr: {
        innerText: new Intl.DateTimeFormat('en-US', dateOptions as any).format(
          dayView
        ),
      },
    });
    setStyle(title, {
      padding: '12px',
      margin: '12px 20px',
    });

    const prevDay = Button({
      attr: {
        textContent: 'prev',
        onclick: () => goToSelectedDayView(dayView, 'previous'),
      },
    });

    const nextDay = Button({
      attr: {
        textContent: 'next',
        onclick: () => goToSelectedDayView(dayView, 'next'),
      },
    });

    headerDate.appendChild(prevDay);
    headerDate.appendChild(title);
    headerDate.appendChild(nextDay);
    el.appendChild(headerDate);

    const meetingsList = Div();
    const events = await getEventsForDay(dayView);

    if (events.length) {
      events.sort(
        (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
      );

      events.forEach((meeting) => {
        if (meeting.allDay) {
          const allDayEventStyles = {
            borderRadius: '4px',
            padding: '12px',
            margin: '12px 20px',
            width: 'auto',
            backgroundColor: 'papayawhip',
            cursor: 'pointer',
          };
          const allDayEvents = createEventCard(meeting, allDayEventStyles);
          el.appendChild(allDayEvents);
        } else {
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

          const start = Span({
            attr: {
              innerText: `${formatDateTime(
                'en-CA',
                timeOptions,
                meeting.start
              )} - `,
            },
          });
          times.appendChild(start);

          if (meeting.end) {
            const end = Span({
              attr: {
                innerText: `${formatDateTime(
                  'en-CA',
                  timeOptions,
                  meeting.end
                )}`,
              },
            });
            times.appendChild(end);
          }

          meetingContainer.appendChild(times);
          const eventStyles = {
            borderRadius: '4px',
            padding: '12px',
            width: '100%',
            backgroundColor: '#d2e7de',
            cursor: 'pointer',
          };
          const event = createEventCard(meeting, eventStyles);

          meetingContainer.appendChild(event);
          meetingsList.appendChild(meetingContainer);
        }
      });

      el.appendChild(meetingsList);
    } else {
      const noEventsLabel = Div({
        attr: { innerText: 'No events this day' },
        styles: { margin: '12px 20px' },
      });
      el.appendChild(noEventsLabel);
    }
  }
  init();
  return el;
}

function createEventCard(
  meeting: IEvent,
  styles: Partial<CSSStyleDeclaration>
) {
  const event = Div({ styles });

  const title = H3({ attr: { innerText: meeting.title } });
  event.appendChild(title);

  if (meeting.description) {
    const description = Div({ attr: { innerText: meeting.description } });
    event.appendChild(description);
  }

  onClick(event, () => setURL(`/events/${meeting._id}`));
  return event;
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
