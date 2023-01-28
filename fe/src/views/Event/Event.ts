import { faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import autolinker from 'autolinker';
import {
  calendarWeek,
  link,
  pencil,
  usersIcon,
  trash,
  clockIcon,
  hourglassEnd,
  hourglassStart,
} from '../../../public/assets/FontAwesomeIcons';
import { buttonStyles } from '../../../public/css/componentStyles';
import { deleteEvent } from '../../apis/EventApi';
import { getUsers } from '../../apis/UserApi';
import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { H3 } from '../../components/elements/H3';
import { Label } from '../../components/elements/Label';
import { Span } from '../../components/elements/Span';
import {
  addTimeZoneOptions,
  formatDateTime,
  dateOptions,
  dateTimeOptions,
  convertMidnightUTCToLocalDay,
  timeOptions,
} from '../../utils/dateHelpers';
import { byId } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fonts,
} from '../../utils/styles';

const styles = {
  ...flexAlignItemsCenter,
  fontFamily: fonts.montserrat,
  fontSize: '14px',
  padding: '4px 0',
  marginTop: '8px',
};

const iconStyles = {
  marginRight: '12px',
  color: basics.spanishGray,
  width: '20px',
  height: '20px',
  ...flexAlignItemsCenter,
  justifyContent: 'center',
};

function icon(iconName: string) {
  return Span({
    attr: { innerHTML: iconName },
    styles: iconStyles,
  });
}

export function Event(event: IEvent) {
  let users: User[] = [];
  const el = Div({
    styles: { padding: '12px', margin: '8px auto auto', maxWidth: '600px' },
  });

  async function init() {
    users = await getUsers();

    const titleContainer = Div({
      styles: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      },
    });
    const title = H3({
      attr: {
        innerText: event.title,
      },
      styles: { padding: '4px 0', marginRight: '8px' },
    });

    const buttons = Div({
      styles: {
        ...styles,
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: '0',
      },
    });
    const remove = Button({
      selectors: { id: 'remove-event-btn' },
      attr: {
        innerHTML: trash,
        onclick: async (e) => {
          e.preventDefault();
          try {
            await deleteEvent(event._id);
            setURL('/');
          } catch (e) {
            const temporaryError = Div({
              attr: {
                innerText: 'Could not delete event',
              },
            });
            el.append(temporaryError);
          }
        },
        onmouseover: () => {
          const button = byId('remove-event-btn');
          if (button) {
            button.style.opacity = '.7';
          }
        },
        onmouseout: () => {
          const button = byId('remove-event-btn');
          if (button) {
            button.style.opacity = '1';
          }
        },
      },
      styles: {
        ...buttonStyles,
        fontSize: '17px',
        padding: '8px',
        marginLeft: '4px',
        background: 'none',
        color: colors.mandarine,
        opacity: '.9',
      },
    });
    const edit = Button({
      selectors: { id: 'edit-event-btn' },
      attr: {
        innerHTML: pencil,
        onclick: async (e) => {
          e.preventDefault();
          setURL(`/events/edit/${event._id}`);
        },
        onmouseover: () => {
          const button = byId('edit-event-btn');
          if (button) {
            button.style.opacity = '.7';
          }
        },
        onmouseout: () => {
          const button = byId('edit-event-btn');
          if (button) {
            button.style.opacity = '1';
          }
        },
      },
      styles: {
        ...buttonStyles,
        fontSize: '17px',
        background: 'none',
        color: colors.royalBlueLight,
        padding: '8px',
      },
    });

    buttons.append(edit);
    buttons.append(remove);

    titleContainer.append(title);
    titleContainer.append(buttons);
    el.append(titleContainer);

    if (event.description) {
      const description = Div({
        attr: {
          innerHTML: autolinker.link(event.description),
        },
        styles: { ...styles, whiteSpace: 'pre-line' },
      });
      el.append(description);
    }

    const connect = Div({ styles });
    const connectIcon = icon(link);
    const connectLink = Span({
      attr: {
        innerHTML: autolinker.link(
          `https://connect.xyzdigital.com/${event._id}`
        ),
      },
    });
    connect.append(connectIcon);
    connect.append(connectLink);
    el.append(connect);

    if (event.allDay) {
      const day = Div({ styles });
      const dateIcon = icon(calendarWeek);
      const localDay = convertMidnightUTCToLocalDay(event.start);
      const dayText = Span({
        attr: {
          innerHTML: `${formatDateTime(dateOptions, localDay)}`,
        },
      });
      day.append(dateIcon);
      day.append(dayText);
      el.append(day);
    } else {
      const datesContainer = Div({ styles: { ...styles, display: 'block' } });
      const endsSameDay =
        event.start.toDateString() === event.end?.toDateString();

      const dates = Div({
        styles: endsSameDay
          ? { ...flexAlignItemsCenter }
          : { display: 'flex', alignItems: 'flex-start' },
      });
      const datesIcon = icon(endsSameDay ? calendarWeek : hourglassStart);

      const startDate = Span({
        attr: {
          innerHTML: `${formatDateTime(
            endsSameDay
              ? dateOptions
              : { ...dateTimeOptions, ...addTimeZoneOptions },
            event.start
          )}`,
        },
      });
      dates.append(datesIcon);
      dates.append(startDate);

      if (!endsSameDay) {
        const hourglassEndIcon = icon(hourglassEnd);
        const endDateFormat = event.end
          ? `${formatDateTime(
              { ...dateTimeOptions, ...addTimeZoneOptions },
              event.end
            )}`
          : '';
        const endDate = Span({ attr: { innerHTML: endDateFormat } });
        dates.append(hourglassEndIcon);
        dates.append(endDate);
      }

      datesContainer.append(dates);

      if (endsSameDay) {
        const times = Div({
          styles: { ...flexAlignItemsCenter, padding: '4px 0' },
        });
        const timeIcon = icon(clockIcon);
        const startTime = Span({
          attr: {
            innerHTML: `${formatDateTime(timeOptions, event.start)}`,
          },
        });

        const toLabel = Label({
          attr: { innerHTML: '-' },
          styles: { padding: '0 8px' },
        });

        const endTimeFormat = event.end
          ? `${formatDateTime(
              { ...timeOptions, ...addTimeZoneOptions },
              event.end
            )}`
          : '';

        const endTime = Span({ attr: { innerHTML: endTimeFormat } });

        times.append(timeIcon);
        times.append(startTime);
        times.append(toLabel);
        times.append(endTime);
        datesContainer.append(times);
      }

      el.append(datesContainer);
    }

    const guests = Div({
      styles: { ...styles, margin: '8px 0 32px', alignItems: 'flex-start' },
    });
    const usersList = event.users?.length
      ? users.filter((user) => event.users?.includes(user._id))
      : users;
    const oneGuest = usersList.length === 1;

    const guestsIcon = icon(usersIcon);
    const guestsList = Div();
    const guestsLabel = Label({
      attr: { innerHTML: `Guest${oneGuest ? '' : 's'}:` },
    });
    guestsList.append(guestsLabel);

    usersList.map((user) => {
      const container = Div({
        styles: { ...flexAlignItemsCenter, margin: '12px 0' },
      });
      const userIcon = Div({
        styles: {
          display: 'flex',
          flexShrink: '0',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          borderRadius: '999px',
          height: '30px',
          width: '30px',
          backgroundColor: user.color || 'black',
          color: 'white',
          textAlign: 'center',
          lineHeight: '30px',
          marginRight: '10px',
          fontSize: '12px',
        },
      });

      const firstInitial = user.name.charAt(0);
      const lastInitial = user.name.split(' ')[1].charAt(0);

      userIcon.innerText = firstInitial + lastInitial;
      const name = Div({ attr: { innerHTML: user.name } });
      container.append(userIcon);
      container.append(name);
      guestsList.append(container);
    });

    guests.append(guestsIcon);
    guests.append(guestsList);

    el.append(guests);
  }

  init();
  return el;
}
