import autolinker from 'autolinker';
import {
  calendarWeek,
  link,
  pencil,
  usersIcon,
  trash,
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
  formatDateTime,
  dateOptions,
  dateTimeOptions,
  convertMidnightUTCToLocalDay,
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
            el.appendChild(temporaryError);
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

    buttons.appendChild(edit);
    buttons.appendChild(remove);

    titleContainer.appendChild(title);
    titleContainer.appendChild(buttons);
    el.appendChild(titleContainer);

    if (event.description) {
      const description = Div({
        attr: {
          innerHTML: autolinker.link(event.description),
        },
        styles: { ...styles, whiteSpace: 'pre-line' },
      });
      el.appendChild(description);
    }

    const connect = Div({ styles: { ...styles, display: 'flex' } });
    const connectIcon = Span({
      attr: { innerHTML: link },
      styles: iconStyles,
    });
    const connectLink = Span({
      attr: {
        innerHTML: autolinker.link(
          `https://connect.xyzdigital.com/${event._id}`
        ),
      },
    });
    connect.appendChild(connectIcon);
    connect.appendChild(connectLink);
    el.appendChild(connect);

    if (event.allDay) {
      const day = Div({ styles: { ...styles, display: 'flex' } });
      const icon = Span({
        attr: { innerHTML: calendarWeek },
        styles: iconStyles,
      });
      const localDay = convertMidnightUTCToLocalDay(event.start);
      const dayText = Span({
        attr: {
          innerHTML: `${formatDateTime('en-CA', dateOptions, localDay)}`,
        },
      });
      day.appendChild(icon);
      day.appendChild(dayText);
      el.appendChild(day);
    } else {
      const datesContainer = Div({ styles: { ...styles, display: 'flex' } });
      const startIcon = Span({
        attr: { innerHTML: calendarWeek },
        styles: iconStyles,
      });

      datesContainer.appendChild(startIcon);

      const dates = Div();
      const startTime = Span({
        attr: {
          innerHTML: `${formatDateTime('en-CA', dateTimeOptions, event.start)}`,
        },
      });
      dates.appendChild(startTime);

      const toLabel = Label({
        attr: { innerHTML: '&nbsp; - &nbsp;' },
      });
      const endDate = event.end
        ? `${formatDateTime('en-CA', dateTimeOptions, event.end)}`
        : '';
      const endTime = Span({ attr: { innerHTML: endDate } });
      dates.appendChild(toLabel);
      dates.appendChild(endTime);
      datesContainer.appendChild(dates);
      el.appendChild(datesContainer);
    }

    const guests = Div({
      styles: { ...styles, margin: '8px 0 32px', display: 'flex' },
    });
    const usersList = event.users?.length
      ? users.filter((user) => event.users?.includes(user._id))
      : users;
    const oneGuest = usersList.length === 1;

    const guestsIcon = Span({
      attr: { innerHTML: usersIcon },
      styles: iconStyles,
    });

    const guestsList = Div();
    const guestsLabel = Label({
      attr: { innerHTML: `Guest${oneGuest ? '' : 's'}:` },
    });
    guestsList.appendChild(guestsLabel);

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
      guestsList.appendChild(container);
    });

    guests.appendChild(guestsIcon);
    guests.appendChild(guestsList);

    el.appendChild(guests);
  }

  init();
  return el;
}
