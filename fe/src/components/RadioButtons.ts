import { byId } from '../utils/DOMutils';
import { Div } from './elements/Div';
import { Input } from './elements/Input/Input';
import { Label } from './elements/Label';

type RadioButtonsProps = {
  selected: string;
  options: string[];
  onChange: (option: string) => void;
};

export function RadioButtons(props: RadioButtonsProps) {
  const el = Div({ styles: { marginBottom: '12px' } });

  props.options?.map((option) => {
    const firstLabel = Label({
      attr: { for: option, innerText: option },
      styles: { marginRight: '8px' },
    });
    const first = Input({
      selectors: { id: option },
      attr: {
        checked: option === props.selected,
        type: 'radio',
        name: 'users',
        value: option,
        onchange: (e) => {
          props.onChange((e.target as HTMLInputElement).value);
        },
      },
      styles: { marginRight: '4px', cursor: 'pointer' },
    });
    el.appendChild(first);
    el.appendChild(firstLabel);
  });
  return el;
}
