import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { CheckboxInput } from '../../components/elements/Input/CheckboxInput';
import { Input } from '../../components/elements/Input/Input';
import { Textarea } from '../../components/elements/Textarea';
import {
  dateOptions,
  formatDateTime,
  timeOptions,
} from '../../utils/dateHelpers';
import { onClick, setStyle } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import { basics, fonts } from '../../utils/styles';
import { MultiSelect } from '../../components/MultiSelect';

export function EditEvent(event: IEvent) {
  let formValues = event;

  const form = document.createElement('form');
  const eventCard = Div({
    styles: {
      backgroundColor: 'papayawhip',
      borderRadius: '4px',
      padding: '12px',
    },
  });

  const title = Input({
    attr: {
      value: event.title,
      name: 'title',
      onchange: (e) =>
        onFormValueChange('title', (e.target as HTMLInputElement).value),
    },
  });
  eventCard.appendChild(title);

  if (event.description) {
    const descriptionContainer = Div({
      styles: { display: 'flex', padding: '4px 8px' },
    });

    const descriptionLabel = Div({ attr: { innerText: 'Description:' } });
    const descriptionInput = Textarea({
      innerText: event.description,
      onchange: (e) =>
        onFormValueChange(
          'description',
          (e.target as HTMLTextAreaElement).value
        ),
    });

    descriptionContainer.appendChild(descriptionLabel);
    descriptionContainer.appendChild(descriptionInput);
    eventCard.appendChild(descriptionContainer);
  }

  const dates = Div({ styles: { display: 'flex', padding: '4px 8px' } });
  if (event.allDay) {
    const day = Div();
    day.innerText = formatDateTime('en-CA', dateOptions, event.start);
    dates.appendChild(day);
  } else {
    const times = Div({ styles: { display: 'flex' } });
    const startDateInput = Input({
      attr: {
        value: `${formatDateTime('en-CA', dateOptions, event.start)}`,
        onchange: (e) =>
          onFormValueChange('start', (e.target as HTMLTextAreaElement).value),
      },
    });

    times.appendChild(startDateInput);

    const startTimeInput = Input({
      attr: {
        value: `${formatDateTime('en-CA', timeOptions, event.start)}`,
        onchange: (e) =>
          onFormValueChange('start', (e.target as HTMLTextAreaElement).value),
      },
    });
    times.appendChild(startTimeInput);

    const to = Div({ attr: { innerText: 'to' } });
    times.appendChild(to);

    const endDateInput = Input({
      attr: {
        value: `${formatDateTime('en-CA', dateOptions, event.end as Date)}`,
        onchange: (e) =>
          onFormValueChange('end', (e.target as HTMLTextAreaElement).value),
      },
    });
    times.appendChild(endDateInput);

    const endTimeInput = Input({
      attr: {
        value: `${formatDateTime('en-CA', timeOptions, event.end as Date)}`,
        onchange: (e) =>
          onFormValueChange('end', (e.target as HTMLTextAreaElement).value),
      },
    });
    times.appendChild(endTimeInput);

    dates.appendChild(times);
  }

  const allDayContainer = Div({
    styles: { display: 'flex', padding: '4px 8px' },
  });
  const allDayInput = CheckboxInput({
    id: `allDay_${event.id}`,
    checked: !!event.allDay,
    onchange: () => console.log('Changed'),
  });
  allDayContainer.appendChild(allDayInput);
  const allDayLabel = document.createElement('label');
  allDayLabel.htmlFor = `allDay_${event.id}`;
  allDayLabel.innerText = 'All day';
  allDayContainer.appendChild(allDayLabel);

  dates.appendChild(allDayContainer);
  eventCard.appendChild(dates);

  const guestsContainer = Div({
    styles: { display: 'flex', padding: '4px 8px' },
  });
  const guestsLabel = document.createElement('label');
  guestsLabel.innerText = 'Guests:';
  guestsContainer.appendChild(guestsLabel);
  eventCard.appendChild(guestsContainer);
  // eventCard.appendChild(UsersSelect(event.users));

  const submit = Div({
    styles: { display: 'flex', justifyContent: 'flex-end', marginTop: '24px' },
  });
  const buttonStyles = {
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    background: '#79B2AF',
    color: basics.whiteColor,
    minWidth: '100px',
    minHeight: '36px',
    fontFamily: fonts.regular,
    letterSpacing: '1',
    marginLeft: '24px',
    cursor: 'pointer',
  };
  const cancelButton = Button({
    text: 'Cancel',
  });
  onClick(cancelButton, () => setURL(`/events/${event.id}`));
  setStyle(cancelButton, buttonStyles);

  const saveButton = Button({
    text: 'Save',
  });
  setStyle(saveButton, buttonStyles);
  onClick(saveButton, (e) => {
    e.preventDefault();
    console.log('fv', formValues);
  });

  submit.append(cancelButton);
  submit.append(saveButton);

  form.append(eventCard);
  form.append(submit);

  function onFormValueChange(name: string, value: any) {
    formValues = {
      ...formValues,
      [name]: value,
    };
  }

  return form;
}
