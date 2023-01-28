import { Div, Label } from '../../components/elements';
import { RadioButtons } from '../../components/RadioButtons';
import { byId } from '../../utils/DOMutils';
import { flexAlignItemsCenter } from '../../utils/styles';
import { UsersCheckboxes } from './UsersCheckboxes';

export function EventPrivacy(
  currentUserId: string,
  selectedUserIds: string[],
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div();
  const sharedOptions = Div({
    styles: { padding: '12px', ...flexAlignItemsCenter },
  });
  const label = Label({
    attr: { innerText: 'Who can see this?' },
    styles: { marginRight: '8px' },
  });

  const isPrivateEvent =
    selectedUserIds?.length === 1 && selectedUserIds[0] === currentUserId;

  let eventPrivacy: 'Me' | 'Others' = isPrivateEvent ? 'Me' : 'Others';

  const privacyRadioButtons = RadioButtons({
    selected: eventPrivacy,
    options: ['Me', 'Others'],
    onChange: onRadioButtonChange,
  });

  const usersCheckboxes = UsersCheckboxes(
    'users-select',
    selectedUserIds,
    (ids: string[]) => {
      onEventStateChange({ users: ids });
    }
  );

  function onRadioButtonChange(privacyOption: string) {
    onEventStateChange({
      users: [currentUserId],
    });
    if (privacyOption === 'Others') {
      el.appendChild(usersCheckboxes);
    } else {
      const usersSelect = byId('users-select');
      usersSelect && el.removeChild(usersSelect);
    }
  }

  sharedOptions.appendChild(label);
  sharedOptions.appendChild(privacyRadioButtons);
  el.appendChild(sharedOptions);

  if (eventPrivacy === 'Others') {
    el.append(usersCheckboxes);
  }

  return el;
}
