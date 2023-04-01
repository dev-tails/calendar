import { Div, Input, Label } from '../../components/elements';
import { flexAlignItemsCenter } from '../../utils/styles';

export function EventEmail(
  isEditing: boolean,
  onSendEmailChange: (send: boolean) => void
) {
  const el = Div({
    styles: { padding: '12px', ...flexAlignItemsCenter },
  });

  const label = Label({
    attr: {
      innerText: isEditing
        ? 'Notify guests about this updates.'
        : 'Notify guests by email.',
    },
    styles: { marginRight: '8px' },
  });

  const checkboxInput = Input({
    attr: { type: 'checkbox', checked: true, onchange: handleChange },
  });

  function handleChange(e: Event) {
    onSendEmailChange((e.currentTarget as HTMLInputElement).checked);
  }

  el.append(checkboxInput);
  el.append(label);
  return el;
}
