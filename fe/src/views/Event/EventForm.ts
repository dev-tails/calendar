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
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fontsWeight,
} from '../../utils/styles';
import { EventDateSelect } from './EventDateSelect';
import { createEvent, editEvent } from '../../apis/EventApi';
import { buttonStyles, inputStyles } from '../../../public/css/componentStyles';
import {
  envelopIcon,
  link,
  times,
} from '../../../public/assets/FontAwesomeIcons';
import { byId } from '../../utils/DOMutils';
import { EventGuests } from './EventGuests';
import { EventPrivacy } from './EventPrivacy';
import { fetchSelf } from '../../apis/UserApi';
import { Modal } from './Modal';
import { getDateStringFromUrl } from '../../utils/dateHelpers';

const modalOptions = ['Yes, please.', "Nah, it's ok."];

export function EventForm(event?: IEvent) {
  const form = Form({
    styles: {
      maxWidth: '600px',
      paddingTop: '24px',
      marginLeft: 'auto',
      marginRight: 'auto',
      background: '#ffffff12',
      borderRadius: '4px',
    },
  });

  async function init() {
    const currentUser = await fetchSelf();
    if (!currentUser) {
      return;
    }
    let initialStart = new Date();
    if (window.location.pathname.includes('/add/')) {
      initialStart = new Date(getDateStringFromUrl());
    }
    let eventTemplate: IEvent = {
      title: '',
      description: '',
      start: initialStart,
      allDay: false,
      users: [currentUser?._id],
      visibility: 'private',
      owner: currentUser._id,
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
      styles: { color: basics.darkCharcoal, fontWeight: fontsWeight.semiBold },
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
            button.style.color = colors.strongRed;
          }
        },
        onmouseout: () => {
          const button = byId('cancel-btn');
          if (button) {
            button.style.color = basics.granite;
          }
        },
      },
      styles: {
        background: 'none',
        border: 'none',
        color: basics.granite,
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
      styles: { color: basics.granite },
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
        color: basics.granite,
      },
    });
    connect.appendChild(connectLabel);
    connect.appendChild(connectLink);
    form.appendChild(connect);

    const guests = EventGuests(
      currentUser._id,
      eventState?.users || [],
      setEventState
    );
    form.appendChild(guests);

    const privacy = EventPrivacy(
      eventState.visibility || 'private',
      setEventState
    );
    form.appendChild(privacy);

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

    form.onsubmit = (e) => {
      e.preventDefault();
      let start = eventState.start;

      if (eventState.allDay) {
        const midnightDate = new Date(eventState.start.getTime());
        midnightDate.setUTCHours(0, 0, 0, 0);
        start = midnightDate;
        delete eventState.end;
      }
      setEventState({ start });
      const isOnlyOwner =
        eventState.users?.length === 1 &&
        eventState.users[0] === eventState.owner;

      isOnlyOwner
        ? onModalResponse(modalOptions[1])
        : Modal({
            icon: envelopIcon,
            label: eventState._id
              ? 'Email guests with updated event?'
              : 'Notify guests by email?',
            options: modalOptions,
            onClick: onModalResponse,
          });
    };

    async function onModalResponse(response: string) {
      let eventId = eventState._id;
      const sendEmail = response === modalOptions[0] ? true : false;
      if (eventId) {
        await editEvent(eventState, sendEmail);
      } else {
        eventId = await createEvent(eventState, sendEmail);
      }

      setURL(`/events/${eventId}`);
    }
  }
  init();
  return form;
}
