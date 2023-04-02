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
  eyeIcon,
} from '../../../public/assets/FontAwesomeIcons';
import { buttonStyles } from '../../../public/css/componentStyles';
import { deleteEvent } from '../../apis/EventApi';
import { fetchSelf, getUsers } from '../../apis/UserApi';
import { Button, Div, H3, Label, Span } from '../../components/elements';
import {
  addTimeZoneOptions,
  formatDateTime,
  dateOptions,
  dateTimeOptions,
  convertMidnightUTCToLocalDay,
  timeOptions,
} from '../../utils/dateHelpers';
import { setURL } from '../../utils/HistoryUtils';
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fonts,
} from '../../utils/styles';
import { Modal } from './Modal';
import { byId } from '../../utils/DOMutils';

const ownerModalOptions = ['Yes, delete, adiós!', "No! Don't delete."];
const notificationModalOptions = [
  'Yes, delete and notify.',
  "Delete but don't notify.",
];

const styles = {
  ...flexAlignItemsCenter,
  fontFamily: fonts.montserrat,
  fontSize: '14px',
  padding: '4px 0',
  marginTop: '12px',
};

const iconStyles = {
  marginRight: '8px',
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
  const el = Div({
    styles: {
      padding: '12px',
      margin: '8px auto 32px auto',
      maxWidth: '600px',
    },
  });

  async function init() {
    const users = await getUsers();
    const currentUser = await fetchSelf();

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
      styles: { padding: '4px 0', marginRight: '16px' },
    });

    const buttons = Div({
      styles: {
        ...styles,

        marginTop: '0',
      },
    });

    const visibilityTooltip = Div({
      attr: {
        innerHTML:
          event.visibility === 'private'
            ? 'Event visible to guests only.'
            : 'Event visible to all users.',
      },
      styles: {
        display: 'none',
        position: 'absolute',
        top: ' -36px',
        width: 'max-content',
        background: '#555555',
        padding: ' 4px 8px',
        borderRadius: '4px',
        fontStyle: 'italic',
        color: basics.whiteColor,
      },
    });

    const visibility = Div({
      attr: {
        innerHTML: eyeIcon,
        onmouseover: () => (visibilityTooltip.style.display = 'block'),
        onmouseout: () => (visibilityTooltip.style.display = 'none'),
      },
      styles: { ...iconStyles, position: 'relative' },
    });

    visibility.append(visibilityTooltip);
    buttons.append(visibility);

    const isOnlyOwner =
      event.users?.length === 1 && event.users[0] === event.owner;

    if (event.owner === currentUser?._id) {
      const removeBtn = Button({
        attr: {
          innerHTML: trash,
          onclick: (e) => {
            e.preventDefault();
            Modal({
              icon: trash,
              label: isOnlyOwner
                ? 'Are you sure you want to delete this event?'
                : 'You are about to delete this event. Do you want to notify guests by email?',
              options: isOnlyOwner
                ? ownerModalOptions
                : notificationModalOptions,
              onClick: handleDeleteEvent,
            });
          },
          onmouseover: () => (removeBtn.style.opacity = '.7'),
          onmouseout: () => (removeBtn.style.opacity = '1'),
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

      const editBtn = Button({
        attr: {
          innerHTML: pencil,
          onclick: async (e) => {
            e.preventDefault();
            setURL(`/events/edit/${event._id}`);
          },
          onmouseover: () => (editBtn.style.opacity = '.7'),
          onmouseout: () => (editBtn.style.opacity = '1'),
        },
        styles: {
          ...buttonStyles,
          fontSize: '17px',
          background: 'none',
          color: colors.royalBlueLight,
          padding: '8px',
        },
      });

      buttons.append(editBtn);
      buttons.append(removeBtn);
    }

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
      const datesContainer = Div({ styles });
      const endsSameDay =
        event.start.toDateString() === event.end?.toDateString();

      const dates = Div({
        styles: endsSameDay
          ? { ...flexAlignItemsCenter, width: '50%' }
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
        hourglassEndIcon.style.justifyContent = 'flex-end';
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
          styles: {
            ...flexAlignItemsCenter,
            width: '50%',
          },
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

    const connect = Div({ styles });
    const connectIcon = icon(link);
    const connectLink = Span({
      attr: {
        innerHTML: autolinker.link(
          `https://preview-iyris.cloud.engramhq.xyz/${event._id}`
        ),
      },
    });
    connect.append(connectIcon);
    connect.append(connectLink);
    el.append(connect);

    const guests = Div({
      styles: { ...styles, margin: '8px 0', alignItems: 'flex-start' },
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
      const name = Div({
        attr: {
          innerHTML: `${user.name} ${
            user._id === event.owner ? '(Organizer)' : ''
          }`,
        },
      });
      container.append(userIcon);
      container.append(name);
      guestsList.append(container);
    });

    guests.append(guestsIcon);
    guests.append(guestsList);

    el.append(guests);

    async function handleDeleteEvent(response: string) {
      const cancelDeleteEvent = response === ownerModalOptions[1];

      if (cancelDeleteEvent) {
        const modal = byId('modal');
        modal.remove();
        return;
      }

      const sendEmail = response === notificationModalOptions[0] ? true : false;

      try {
        await deleteEvent(event._id, sendEmail);
        setURL('/');
      } catch (e) {
        const temporaryError = Div({
          attr: {
            innerText: 'Could not delete event',
          },
        });
        el.append(temporaryError);
      }
    }
  }

  init();
  return el;
}
