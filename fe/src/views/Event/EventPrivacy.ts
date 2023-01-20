import { Div } from '../../components/elements/Div';
import { RadioButtons } from '../../components/RadioButtons';
import { byId } from '../../utils/DOMutils';
import { UsersCheckboxes } from './UsersCheckboxes';

export function EventPrivacy(
  currentUserId: string,
  selectedUserIds: string[],
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div({ styles: { padding: '12px' } });

  const isPrivateEvent =
    selectedUserIds?.length === 1 && selectedUserIds[0] === currentUserId;

  let eventPrivacy: 'Private' | 'Public' = isPrivateEvent
    ? 'Private'
    : 'Public';

  const privacyRadioButtons = RadioButtons({
    selected: eventPrivacy,
    options: ['Private', 'Public'],
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
    if (privacyOption === 'Public') {
      onEventStateChange({ users: [] });
      el.appendChild(usersCheckboxes);
    } else {
      onEventStateChange({ users: [currentUserId] });
      const usersSelect = byId('users-select');
      usersSelect && el.removeChild(usersSelect);
    }
  }

  el.appendChild(privacyRadioButtons);

  if (eventPrivacy === 'Public') {
    el.appendChild(usersCheckboxes);
  }

  return el;
}
