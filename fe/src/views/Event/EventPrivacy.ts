import { Div, Label } from '../../components/elements';
import { RadioButtons } from '../../components/RadioButtons';
import { flexAlignItemsCenter } from '../../utils/styles';

export function EventPrivacy(
  visibility: 'private' | 'public',
  onEventStateChange: (eventState: Partial<IEvent>) => void
) {
  const el = Div({
    styles: { padding: '12px', ...flexAlignItemsCenter },
  });

  const label = Label({
    attr: { innerText: 'Who can see this?' },
    styles: { marginRight: '8px' },
  });

  const privacyTypeRadioButtons = RadioButtons({
    selected: visibility === 'private' ? 'Only guests' : 'Everyone',
    options: ['Only guests', 'Everyone'],
    name: 'privacy',
    onChange: (e) => {
      onEventStateChange({
        visibility: e === 'Only guests' ? 'private' : 'public',
      });
    },
  });

  el.append(label);
  el.append(privacyTypeRadioButtons);
  return el;
}
