import { fetchSelf } from '../../apis/UserApi';
import { Div } from '../../components/elements/Div';
import { Label } from '../../components/elements/Label';
import { RadioButtons } from '../../components/RadioButtons';
import { byId } from '../../utils/DOMutils';

export function EventUsers(
  selectedUsers: string[] | undefined,
  currentUserId: string,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div({ styles: { padding: '12px' } });
  let currentUser: User | null = null;

  console.log('Selected users', selectedUsers);
  async function init() {
    currentUser = await fetchSelf();
    const isPrivateEvent =
      selectedUsers?.length === 1 && selectedUsers[0] === currentUser?._id;
    const privacy = isPrivateEvent ? 'Private' : 'Public';

    let eventPrivacy: 'Private' | 'Public' = privacy;

    const privacyRadioButtons = RadioButtons({
      selected: eventPrivacy,
      options: [{ label: 'Private' }, { label: 'Public' }],
      onChange: (privacyOption) => {
        if (privacyOption === 'Public') {
          const usersSelect = Div({
            selectors: { id: 'users-select' },
            attr: { innerHTML: 'here I will select users' },
          });
          el.appendChild(usersSelect);
          onEventStateChange({ users: [currentUserId] });
        } else {
          const usersSelect = byId('users-select');
          usersSelect && el.removeChild(usersSelect);
          onEventStateChange({ users: [] });
        }
      },
    });

    el.appendChild(privacyRadioButtons);
  }

  init();
  return el;
}
