import { getEventsForDay } from '../../../apis/EventApi';
import { Div, Span } from '../../../components/elements';
import { byId } from '../../../utils/DOMutils';
import { setURL } from '../../../utils/HistoryUtils';
import { formatDateTime, timeOptions } from '../../../utils/dateHelpers';
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fonts,
  fontsWeight,
} from '../../../utils/styles';

const hours = [
  '00',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
];

export function DayGrid() {
  const el = Div({
    styles: {
      // maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  });

  async function init() {
    const gridContainer = Div();
    gridContainer.setAttribute(
      'style',
      // 'width: 100%; height: fit-content; display: flex;background-image: linear-gradient(to bottom, #114357, #F29492, #114357);'
      'width: 100%; height: fit-content; display: flex;'
    );

    const eventsGrid = Div();
    eventsGrid.setAttribute(
      'style',
      'position: relative; width: 90%; height: 100%;'
    );

    hours.map((hour) => {
      const timeContainer = Div({
        styles: {
          position: 'relative',
          height: `${60 * 1}px`,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        },
      });

      const divider = Div({
        styles: {
          position: 'absolute',
          top: '0',
          height: '1px',
          width: '100%',
          background: basics.whiteColor,
          opacity: '.2',
        },
      });

      timeContainer.append(divider);
      eventsGrid.append(timeContainer);
    });

    const timeColumn = Div();
    timeColumn.setAttribute(
      'style',
      'width: 10%; height: 100%; display: flex; flex-direction: column; align-items: flex-end; color: #333; font-size: 14px;'
    );

    hours.map((hour) => {
      const timeContainer = Div({
        styles: {
          position: 'relative',
          height: `${60 * 1}px`,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        },
      });

      const divider = Div({
        styles: {
          position: 'absolute',
          top: '0',
          height: '1px',
          width: '40%',
          right: '0',
          background: basics.whiteColor,
          opacity: '.2',
        },
      });
      const time = Div({
        attr: { innerHTML: hour },
        styles: {
          position: 'absolute',
          top: '-10px',
          left: '5px',
          fontFamily: fonts.montserrat,
          color: basics.whiteColor,
          padding: '0 8px',
        },
      });
      timeContainer.append(divider);
      timeContainer.append(time);
      timeColumn.append(timeContainer);
    });

    gridContainer.append(timeColumn);
    gridContainer.append(eventsGrid);
    el.append(gridContainer);

    const events = await getEventsForDay(new Date());

    events.forEach((event) => {
      if (!event.allDay) {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
      }
    });
  }
  init();

  return el;
}

function createEventCard(event: IEvent) {
  const { _id, start, end, title } = event;
  const eventCard = Div({
    styles: {
      width: '100%',
      maxWidth: '980px',
      position: 'absolute',
      height: '100%',
      top: '0',
    },
  });

  const startTime = `${formatDateTime(timeOptions, start)} `;
  const endTime = `${formatDateTime(timeOptions, end as Date)}`;

  const eventInMinutes = Math.abs((end as any) - (start as any)) / 60000;

  const startTimeHour = start.getHours() * 60;
  const startTimeMinutes = start.getMinutes();
  const timeOffset = startTimeHour + startTimeMinutes;

  console.log('timeOffset', timeOffset);
  const eventTitle = Div({
    attr: {
      innerHTML: `${title} ${startTime} - ${endTime}`.replace(/\./g, ''),
      onclick: () => setURL(`/events/${_id}`),
    },
    styles: {
      backgroundColor: colors.keppel,
      color: basics.whiteColor,
      cursor: 'pointer',
      fontFamily: fonts.montserrat,
      fontWeight: '300',
      padding: '12px',
      height: `${eventInMinutes * 1}px`,
      width: '100%',
      position: 'absolute',
      top: `${timeOffset * 1}px`,
      borderRadius: '4px',
    },
  });
  eventCard.appendChild(eventTitle);

  return eventCard;
}
