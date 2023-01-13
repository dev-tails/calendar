import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Textarea } from '../../components/elements/Textarea';
import { onClick, setStyle } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';
import { basics, fonts } from '../../utils/styles';
import { Label } from '../../components/elements/Label';
import { DateSelect } from './EventDateSelect';
import { createEvent } from '../../apis/EventApi';
import { H3 } from '../../components/elements/H3';
import { formatSplitDate } from '../../utils/dateHelpers';

let eventState: IEvent = {
  title: '',
  description: '',
  start: new Date(),
  allDay: false,
  // users: [] as string[],
};

function setEventState(newValue: Partial<IEvent>) {
  const modifiedEvent: IEvent = {
    ...eventState,
    ...newValue,
  };
  eventState = modifiedEvent;
}

export function AddEvent() {
  const form: HTMLFormElement = document.createElement('form');

  const addEventHeader = H3({ attr: { innerText: 'Add event' } });
  form.appendChild(addEventHeader);

  //Title
  const titleContainer = Div({ styles: { padding: '12px' } });
  const titleInput = Input({
    attr: {
      name: 'title',
      value: eventState['title'],
      onchange: (e) => {
        setEventState({ title: (e.target as HTMLInputElement).value });
      },
      placeholder: 'Title',
      required: true,
    },
  });
  titleContainer.appendChild(titleInput);
  form.appendChild(titleContainer);

  //Description
  const descriptionContainer = Div({
    styles: { padding: '12px', display: 'flex', flexDirection: 'column' },
  });
  const descriptionLabel = Label({ attr: { innerText: 'Description' } });
  const descriptionInput = Textarea({
    attr: {
      name: 'description',
      value: eventState['description'],
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

  //Dates
  const dateContainer = DateSelect(eventState, setEventState);
  form.appendChild(dateContainer);

  //Guests
  /*
  const guestsContainer = Div({
    styles: { display: 'flex', padding: '12px' },
  });
  const guestsLabel = Label({
    attr: { innerText: 'Guests' },
    styles: {
      marginRight: '12px',
    },
  });
  guestsContainer.appendChild(guestsLabel);

  const usersKeyValuePairs = Object.entries(users);

  const usersSelectEl = MultiSelect(usersKeyValuePairs, () =>
    onUsersSelectChange(usersSelectEl.selectedOptions)
  );
  guestsContainer.appendChild(usersSelectEl);
  form.appendChild(guestsContainer);

  const guestsLabelInfo = Label({
    attr: {
      innerText:
        '* Hold down the control (ctrl) button to select multiple options. For Mac: Hold down the command button to select multiple options.',
    },
    styles: {
      padding: '12px',
    },
  });
  form.append(guestsLabelInfo);
  */

  //Buttons
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
    },
  });
  onClick(cancelButton, () => setURL(`/`));
  setStyle(cancelButton, buttonStyles);

  const saveButton = Button({
    attr: {
      textContent: 'Save',
      type: 'submit',
    },
  });
  setStyle(saveButton, buttonStyles);

  buttons.appendChild(cancelButton);
  buttons.appendChild(saveButton);
  form.appendChild(buttons);

  form.onsubmit = (e) => {
    e.preventDefault();
    let start = eventState.start;
    if (eventState.allDay) {
      const midnightDate = eventState.start;
      midnightDate.setUTCHours(0, 0, 0, 0);
      start = midnightDate;
      delete eventState.end;
    }
    eventState = { ...eventState, start };
    console.log('submitting', eventState);
    // createEvent(eventState);
    // const dateString = formatSplitDate(eventState.start, '/', 'yyyy-mm-dd');
    // setURL(`/day/${dateString}`);
  };

  return form;
}

function onUsersSelectChange(
  selectedOptions: HTMLCollectionOf<HTMLOptionElement>
) {
  const selectedUsersKeys = Array.from(selectedOptions)?.map((selectedUser) => {
    return selectedUser.value;
  });
  setEventState({ users: selectedUsersKeys });
}
