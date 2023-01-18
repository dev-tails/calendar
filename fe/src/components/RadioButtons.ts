import { byId } from '../utils/DOMutils';
import { Div } from './elements/Div';
import { Input } from './elements/Input/Input';
import { Label } from './elements/Label';

type RadioButtonsProps = {
  selected: string;
  options: { label: string }[];
  onChange: (option: string) => void;
};

export function RadioButtons(props: RadioButtonsProps) {
  const el = Div();

  props.options?.map((option) => {
    const { label } = option;

    const firstLabel = Label({
      attr: { for: label, innerText: label },
      styles: { marginRight: '8px' },
    });
    const first = Input({
      selectors: { id: label },
      attr: {
        checked: label === props.selected,
        type: 'radio',
        name: 'users',
        value: label,
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
