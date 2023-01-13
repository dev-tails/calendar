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
  const el = Div({
    styles: {
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  });

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

    const eventsList = Div();
    const events = await getEventsForDay(dayView);

    if (events.length) {
      events.sort(
        (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
      );

      events.forEach((event) => {
        if (event.allDay) {
          const allDayEventStyles = {
            borderRadius: '4px',
            padding: '12px',
            margin: '12px 20px',
            width: 'auto',
            backgroundColor: 'papayawhip',
            cursor: 'pointer',
          };
          const allDayEvents = createEventCard(event, allDayEventStyles);
          el.appendChild(allDayEvents);
        } else {
          const eventContainer = Div({
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
                event.start
              )} - `,
            },
          });
          times.appendChild(start);

          if (event.end) {
            const end = Span({
              attr: {
                innerText: `${formatDateTime('en-CA', timeOptions, event.end)}`,
              },
            });
            times.appendChild(end);
          }

          eventContainer.appendChild(times);
          const eventStyles = {
            borderRadius: '4px',
            padding: '12px',
            width: '100%',
            backgroundColor: '#d2e7de',
            cursor: 'pointer',
            maxWidth: '980px',
          };
          const eventCard = createEventCard(event, eventStyles);

          eventContainer.appendChild(eventCard);
          eventsList.appendChild(eventContainer);
        }
      });

      el.appendChild(eventsList);
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

function createEventCard(event: IEvent, styles: Partial<CSSStyleDeclaration>) {
  const eventCard = Div({ styles });

  const textStyles = {
    overflow: 'hidden',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const title = H3({
    attr: { innerText: event.title },
    styles: textStyles,
  });
  eventCard.appendChild(title);

  if (event.description) {
    const description = Div({
      attr: { innerText: event.description },
      styles: textStyles,
    });
    eventCard.appendChild(description);
  }

  onClick(eventCard, () => setURL(`/events/${event._id}`));
  return eventCard;
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
