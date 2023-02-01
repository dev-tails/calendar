import { Div, Label } from '../../components/elements';
import { RadioButtons } from '../../components/RadioButtons';
import { byId } from '../../utils/DOMutils';
import { flexAlignItemsCenter } from '../../utils/styles';
import { UsersCheckboxes } from './UsersCheckboxes';

export function EventGuests(
  currentUserId: string,
  selectedUserIds: string[],
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div();
  const sharedOptions = Div({
    styles: { padding: '12px', ...flexAlignItemsCenter },
  });

  const label = Label({
    attr: { innerText: 'Guests:' },
    styles: { marginRight: '8px' },
  });

  const currentGuests =
    selectedUserIds?.length === 1 && selectedUserIds[0] === currentUserId;

  let guests: 'Me' | 'Others' = currentGuests ? 'Me' : 'Others';

  const guestsRadioButtons = RadioButtons({
    selected: guests,
    options: ['Me', 'Others'],
    name: 'users',
    onChange: onRadioButtonChange,
  });

  const usersCheckboxes = UsersCheckboxes(
    'users-select',
    selectedUserIds,
    (ids: string[]) => {
      onEventStateChange({ users: ids });
    }
  );

  function onRadioButtonChange(option: string) {
    onEventStateChange({
      users: [currentUserId],
    });
    if (option === 'Others') {
      el.appendChild(usersCheckboxes);
    } else {
      const usersSelect = byId('users-select');
      usersSelect && el.removeChild(usersSelect);
    }
  }

  sharedOptions.appendChild(label);
  sharedOptions.appendChild(guestsRadioButtons);
  el.appendChild(sharedOptions);

  if (guests === 'Others') {
    el.append(usersCheckboxes);
  }

  return el;
}
