import { Div } from '../../components/elements/Div';
import { H3 } from '../../components/elements/H3';
import {
  formatDateTime,
  dateOptions,
  dateTimeOptions,
} from '../../utils/dateHelpers';

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
    day.innerText = `${formatDateTime('en-CA', dateOptions, event.start)}`;
    el.appendChild(day);
  }

  if (event.start && event.end) {
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
    end.innerHTML = `End: ${formatDateTime(
      'en-CA',
      dateTimeOptions,
      event.end
    )}`;
    el.appendChild(end);
  }

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
