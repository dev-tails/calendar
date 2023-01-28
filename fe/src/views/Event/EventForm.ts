import autolinker from 'autolinker';

import {
  Button,
  Div,
  Input,
  Textarea,
  Label,
  H3,
  Form,
  Span,
} from '../../components/elements';
import { setURL } from '../../utils/HistoryUtils';
import { basics, colors, flexAlignItemsCenter } from '../../utils/styles';
import { EventDateSelect } from './EventDateSelect';
import { createEvent, editEvent } from '../../apis/EventApi';
import { buttonStyles, inputStyles } from '../../../public/css/componentStyles';
import { link, times } from '../../../public/assets/FontAwesomeIcons';
import { byId } from '../../utils/DOMutils';
import { EventPrivacy } from './EventPrivacy';
import { fetchSelf } from '../../apis/UserApi';

export function EventForm(event?: IEvent) {
  const form = Form({
    styles: {
      maxWidth: '600px',
      paddingTop: '24px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  });

  async function init() {
    const currentUser = await fetchSelf();
    if (!currentUser) {
      return;
    }
    let eventTemplate: IEvent = {
      title: '',
      description: '',
      start: new Date(),
      allDay: false,
      users: [currentUser?._id],
    };

    const eventState: IEvent = event ? { ...event } : { ...eventTemplate };

    const setEventState = (newValue: Partial<IEvent>) => {
      Object.assign(eventState, newValue);
    };

    const headerContainer = Div({
      styles: {
        ...flexAlignItemsCenter,
        justifyContent: 'space-between',
        padding: '0px 12px',
      },
    });

    const editEventHeader = H3({
      attr: { innerText: `${eventState._id ? 'Edit' : 'Add'} event` },
    });

    const cancelButton = Button({
      selectors: {
        id: 'cancel-btn',
      },
      attr: {
        innerHTML: times,
        type: 'button',
        onclick: () => setURL('/'),
        onmouseover: () => {
          const button = byId('cancel-btn');
          if (button) {
            button.style.color = colors.mandarine;
          }
        },
        onmouseout: () => {
          const button = byId('cancel-btn');
          if (button) {
            button.style.color = basics.silver;
          }
        },
      },
      styles: {
        background: 'none',
        border: 'none',
        color: basics.silver,
        fontSize: '24px',
        padding: '0',
      },
    });

    headerContainer.appendChild(editEventHeader);
    headerContainer.appendChild(cancelButton);
    form.appendChild(headerContainer);

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
      styles: { ...inputStyles, width: '100%' },
    });

    titleContainer.appendChild(titleInput);
    form.appendChild(titleContainer);

    const descriptionContainer = Div({
      styles: { padding: '12px', display: 'flex', flexDirection: 'column' },
    });
    const descriptionLabel = Label({
      attr: { innerText: 'Description:' },
      styles: {
        marginBottom: '4px',
      },
    });
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
      styles: { ...inputStyles, minHeight: '160px' },
    });
    descriptionContainer.appendChild(descriptionLabel);
    descriptionContainer.appendChild(descriptionInput);
    form.appendChild(descriptionContainer);

    const dateContainer = EventDateSelect(eventState, setEventState);
    form.appendChild(dateContainer);

    const connect = Div({ styles: { padding: '12px' } });
    const connectLabel = Span({
      attr: { innerHTML: link },
      styles: { color: basics.spanishGray },
    });

    const connectLink = Label({
      attr: {
        innerHTML: eventState._id
          ? autolinker.link(
              `https://preview-iyris.cloud.engramhq.xyz/${eventState._id}`
            )
          : 'Connect link will be created with event.',
      },
      styles: {
        marginLeft: '8px',
        color: basics.spanishGray,
      },
    });
    connect.appendChild(connectLabel);
    connect.appendChild(connectLink);
    form.appendChild(connect);

    const guests = EventPrivacy(
      currentUser._id,
      eventState?.users || [],
      setEventState
    );
    form.appendChild(guests);

    const buttons = Div({
      styles: { marginTop: '8px', padding: '12px' },
    });

    const saveButton = Button({
      selectors: { id: 'save-btn' },
      attr: {
        textContent: 'Save',
        type: 'submit',
        onmouseover: () => {
          const button = byId('save-btn');
          if (button) {
            button.style.opacity = '.9';
          }
        },
        onmouseout: () => {
          const button = byId('save-btn');
          if (button) {
            button.style.opacity = '1';
          }
        },
      },
      styles: buttonStyles,
    });

    buttons.appendChild(saveButton);
    form.appendChild(buttons);

    form.onsubmit = async (e) => {
      e.preventDefault();
      let start = eventState.start;

      if (eventState.allDay) {
        const midnightDate = new Date(eventState.start.getTime());
        midnightDate.setUTCHours(0, 0, 0, 0);
        start = midnightDate;
        delete eventState.end;
      }
      setEventState({ start });

      let eventId = eventState._id;
      console.log('submitting', eventState);
      if (eventId) {
        await editEvent(eventState);
      } else {
        eventId = await createEvent(eventState);
      }
      setURL(`/events/${eventId}`);
    };
  }
  init();
  return form;
}
