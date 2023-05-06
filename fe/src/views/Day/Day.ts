import { getEventsForDay } from '../../apis/EventApi';
import {
  formatDateTime,
  dateOptions,
  timeOptions,
  formatSplitDate,
} from '../../utils/dateHelpers';
import { byId, onKeydown, setStyle } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fonts,
  fontsWeight,
} from '../../utils/styles';
import { Button, Div, Span, H1, P } from '../../components/elements';
import {
  chevronLeft,
  chevronRight,
} from '../../../public/assets/FontAwesomeIcons';

const arrowStyles = {
  background: 'none',
  border: 'none',
  color: basics.whiteColor,
  fontSize: '24px',
  padding: '12px',
};
export function Day(date?: string) {
  let dayView = date ? new Date(date) : new Date();
  const el = Div({
    styles: {
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  });

  async function init() {
    const headerDate = Div({
      styles: {
        ...flexAlignItemsCenter,
        margin: '20px 12px',
      },
    });

    const title = H1({
      attr: {
        innerText: new Intl.DateTimeFormat('en-US', dateOptions as any).format(
          dayView
        ),
      },
      styles: {
        fontFamily: fonts.poppins,
        fontWeight: '400',
        fontSize: '32px,',
        color: basics.whiteColor,
        padding: '12px',
      },
    });
    setStyle(title, { padding: '12px' });

    const prevDay = Button({
      selectors: {
        id: 'left-chevron',
      },
      attr: {
        innerHTML: chevronLeft,
        onclick: () => goToSelectedDayView(dayView, 'previous'),
        onmouseover: () => {
          const button = byId('left-chevron');
          if (button) {
            button.style.background = colors.royalBlueLight;
            button.style.borderRadius = '4px';
            button.style.color = basics.whiteColor;
          }
        },
        onmouseout: () => {
          const button = byId('left-chevron');
          if (button) {
            button.style.color = basics.whiteColor;
            button.style.background = 'none';
            button.style.borderRadius = 'none';
          }
        },
      },
      styles: arrowStyles,
    });

    const nextDay = Button({
      selectors: {
        id: 'right-chevron',
      },
      attr: {
        innerHTML: chevronRight,
        onclick: () => goToSelectedDayView(dayView, 'next'),
        onmouseover: () => {
          const button = byId('right-chevron');
          if (button) {
            button.style.background = colors.royalBlueLight;
            button.style.borderRadius = '4px';
            button.style.color = basics.whiteColor;
          }
        },
        onmouseout: () => {
          const button = byId('right-chevron');
          if (button) {
            button.style.color = basics.whiteColor;
            button.style.background = 'none';
          }
        },
      },
      styles: arrowStyles,
    });

    // onKeydown(document, changeActiveDay);
    headerDate.appendChild(prevDay);
    headerDate.appendChild(nextDay);
    headerDate.appendChild(title);
    el.appendChild(headerDate);

    const eventsList = Div();
    const allDayEventsContainer = Div({
      styles: { display: 'flex', gap: '16px', margin: '12px 20px' },
    });
    const events = await getEventsForDay(dayView);

    if (events.length) {
      events.sort(
        (date1, date2) => date1.start.valueOf() - date2.start.valueOf()
      );

      events.forEach((event) => {
        if (event.allDay) {
          const allDayEventStyles = {
            borderRadius: '4px',
            width: 'fit-content',
            backgroundColor: basics.whiteColor,
            color: colors.mandarine,
            cursor: 'pointer',
          };
          const allDayEvents = createEventCard(event, allDayEventStyles);
          allDayEventsContainer.append(allDayEvents);
        } else {
          const eventContainer = Div({
            styles: {
              borderRadius: '4px',
              margin: '0 20px',
              gridGap: '20px',
              ...flexAlignItemsCenter,
            },
          });

          const times = Div({
            styles: {
              display: 'flex',
              marginBottom: 'auto',
              maxWidth: '180px',
              width: '100%',
              padding: '8px 12px',
            },
          });
          if (event.start && event.end) {
            const startTime = `${formatDateTime(timeOptions, event.start)} `;

            const endTime = `${formatDateTime(timeOptions, event.end)}`;

            const timesText = Span({
              attr: {
                innerText: `${startTime} - ${endTime}`.replace(/\./g, ''),
              },
              styles: {
                textTransform: 'uppercase',
                fontFamily: fonts.montserrat,
                color: basics.darkCharcoal,
                fontWeight: fontsWeight.regular,
                fontSize: '14px',
                padding: '12px 0',
              },
            });
            times.appendChild(timesText);
          }

          eventContainer.appendChild(times);
          const eventStyles = {
            borderRadius: '4px',
            width: '100%',
            backgroundColor: colors.royalBlueLight,
            color: basics.whiteColor,
            cursor: 'pointer',
            maxWidth: '980px',
          };
          const eventCard = createEventCard(event, eventStyles);

          eventContainer.appendChild(eventCard);
          eventsList.appendChild(eventContainer);
        }
      });
      el.appendChild(allDayEventsContainer);
      el.appendChild(eventsList);
    } else {
      const noEventsLabel = Div({
        attr: { innerText: 'No events.' },
        styles: {
          fontFamily: fonts.montserrat,
          margin: '12px 20px',
          fontStyle: 'italic',
          color: basics.slateGray,
        },
      });
      el.appendChild(noEventsLabel);
    }

    const button = Button({
      attr: {
        innerHTML: 'grid',
        onclick: () => {
          setURL('/grid');
        },
      },
    });
    // el.appendChild(button);
  }

  function changeActiveDay(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      goToSelectedDayView(dayView, 'next');
    }
    if (e.key === 'ArrowLeft') {
      goToSelectedDayView(dayView, 'previous');
    }
    return;
  }
  init();
  return el;
}

function createEventCard(event: IEvent, styles: Partial<CSSStyleDeclaration>) {
  const eventCard = Div({ styles });

  const title = P({
    attr: {
      innerText: event.title,
      onclick: () => setURL(`/events/${event._id}`),
    },
    styles: {
      fontFamily: fonts.poppins,
      fontWeight: '400',
      padding: '12px',
    },
  });
  eventCard.appendChild(title);

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
