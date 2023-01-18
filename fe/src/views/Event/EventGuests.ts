import { Div } from '../../components/elements/Div';
import { Label } from '../../components/elements/Label';
import { RadioButtons } from '../../components/RadioButtons';
import { byId } from '../../utils/DOMutils';

export function EventUsers(
  selected: string,
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  let eventPrivacy: 'Private' | 'Public' = 'Private';
  const el = Div({ styles: { padding: '12px' } });

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
      } else {
        const usersSelect = byId('users-select');
        usersSelect && el.removeChild(usersSelect);
      }
    },
  });

  el.appendChild(privacyRadioButtons);

  return el;
}
