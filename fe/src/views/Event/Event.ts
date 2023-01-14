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
import { setURL } from '../../utils/HistoryUtils';

export function Event(event: IEvent) {
  const el = Div({ styles: { padding: '12px' } });

  const title = H3({
    attr: {
      innerText: event.title,
    },
    styles: { padding: '4px 0' },
  });
  el.appendChild(title);

  if (event.description) {
    const description = Div({ styles: { padding: '4px 0' } });
    description.innerText = event.description;
    el.appendChild(description);
  }

  if (event.allDay) {
    const day = Div({ styles: { padding: '4px 0' } });
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
      styles: { padding: '4px 0' },
    });
    el.appendChild(start);

    const end = Div({ styles: { padding: '4px 0' } });
    const endDate = event.end
      ? `${formatDateTime('en-CA', dateTimeOptions, event.end)}`
      : '';
    end.innerHTML = `End: ${endDate}`;
    el.appendChild(end);
  }

  const button = Button({
    attr: {
      textContent: 'Delete',
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
    },
    styles: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '24px',
      cursor: 'pointer',
    },
  });

  el.appendChild(button);

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
