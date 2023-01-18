import autolinker from 'autolinker';
import { pencil, trash } from '../../../public/assets/FontAwesomeIcons';
import { buttonStyles } from '../../../public/css/componentStyles';
import { deleteEvent } from '../../apis/EventApi';
import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { H3 } from '../../components/elements/H3';
import {
  formatDateTime,
  dateOptions,
  dateTimeOptions,
  convertMidnightUTCToLocalDay,
} from '../../utils/dateHelpers';
import { byId } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import { basics, colors, fonts } from '../../utils/styles';

const styles = {
  fontFamily: fonts.montserrat,
  fontSize: '14px',
  padding: '4px 0',
  marginTop: '8px',
};

export function Event(event: IEvent) {
  const el = Div({
    styles: { padding: '12px', margin: '8px auto auto', maxWidth: '600px' },
  });

  const title = H3({
    attr: {
      innerText: event.title,
    },
    styles: { padding: '4px 0' },
  });
  el.appendChild(title);

  if (event.description) {
    const description = Div({ styles });
    description.innerHTML = autolinker.link(event.description);
    el.appendChild(description);
  }

  if (event.allDay) {
    const day = Div({ styles });
    const localDay = convertMidnightUTCToLocalDay(event.start);
    day.innerText = `${formatDateTime('en-CA', dateOptions, localDay)}`;
    el.appendChild(day);
  } else {
    const start = Div({
      attr: {
        innerText: `Start: ${formatDateTime(
          'en-CA',
          dateTimeOptions,
          event.start
        )}`,
      },
      styles,
    });
    el.appendChild(start);

    const end = Div({ styles: { ...styles, marginTop: '0' } });
    const endDate = event.end
      ? `${formatDateTime('en-CA', dateTimeOptions, event.end)}`
      : '';
    end.innerHTML = `End: ${endDate}`;
    el.appendChild(end);
  }

  const buttons = Div({ styles: { marginTop: '40px' } });
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
          button.style.opacity = '.9';
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
      marginLeft: '12px',
      backgroundColor: colors.lightOrange,
      color: basics.whiteColor,
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
          button.style.opacity = '.9';
        }
      },
      onmouseout: () => {
        const button = byId('edit-event-btn');
        if (button) {
          button.style.opacity = '1';
        }
      },
    },
    styles: buttonStyles,
  });

  buttons.appendChild(edit);
  buttons.appendChild(remove);
  el.appendChild(buttons);

  /*
  const guestsIinnerText =
    'Guests: ' +
    event.users.map((user) => users[user as keyof typeof users]).join(', ');
  const guests = Div({
    attr: { innerText: guestsIinnerText },
    styles: { padding: '4px 0' },
  });
  el.appendChild(guests);
  */

  return el;
}
