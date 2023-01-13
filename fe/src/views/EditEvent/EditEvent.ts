import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Textarea } from '../../components/elements/Textarea';
import { setURL } from '../../utils/HistoryUtils';
import { basics, fonts } from '../../utils/styles';
import { Label } from '../../components/elements/Label';
import { H3 } from '../../components/elements/H3';
import { DateSelect } from '../AddEvent/EventDateSelect';
import { Form } from '../../components/elements/Form';

export function EditEvent(event: IEvent) {
  let eventState: IEvent = {
    title: '',
    description: '',
    start: new Date(),
    allDay: false,
  };

  function setEventState(newValue: Partial<IEvent>) {
    Object.assign(eventState, newValue);
  }

  const form = Form();

  const editEventHeader = H3({ attr: { innerText: 'Edit event' } });
  form.appendChild(editEventHeader);

  const titleContainer = Div({ styles: { padding: '12px' } });
  const titleInput = Input({
    attr: {
      name: 'title',
      value: event['title'],
      onchange: (e) => {
        setEventState({ title: (e.target as HTMLInputElement).value });
      },
      placeholder: 'Title',
      required: true,
    },
  });
  titleContainer.appendChild(titleInput);
  form.appendChild(titleContainer);

  const descriptionContainer = Div({
    styles: { padding: '12px', display: 'flex', flexDirection: 'column' },
  });
  const descriptionLabel = Label({ attr: { innerText: 'Description' } });
  const descriptionInput = Textarea({
    attr: {
      name: 'description',
      value: event['description'],
      onchange: (e) => {
        setEventState({
          description: (e.target as HTMLTextAreaElement).value,
        });
      },
      placeholder: 'Write something...',
    },
  });
  descriptionContainer.appendChild(descriptionLabel);
  descriptionContainer.appendChild(descriptionInput);
  form.appendChild(descriptionContainer);

  const dateContainer = DateSelect(eventState, setEventState);
  form.appendChild(dateContainer);

  const buttons = Div({
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
    attr: {
      textContent: 'Cancel',
      onclick: () => setURL('/'),
    },
    styles: buttonStyles,
  });

  const saveButton = Button({
    attr: {
      textContent: 'Save',
      type: 'submit',
    },
    styles: buttonStyles,
  });

  buttons.appendChild(cancelButton);
  buttons.appendChild(saveButton);
  form.appendChild(buttons);

  form.onsubmit = (e) => {
    e.preventDefault();
    let start = eventState.start;

    if (eventState.allDay) {
      const midnightDate = new Date(eventState.start.getTime());
      midnightDate.setUTCHours(0, 0, 0, 0);
      start = midnightDate;
      delete eventState.end;
    }
    // setEventState({ start });/////
    eventState = { ...eventState, start };

    // createEvent(eventState);
    console.log('event State', eventState);
    setURL(`/events/edit/${event._id}`);
  };

  return form;
}
