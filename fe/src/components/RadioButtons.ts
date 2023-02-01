import { Div, Input, Label } from './elements';

type RadioButtonsProps = {
  selected: string;
  options: string[];
  name: string;
  onChange: (option: string) => void;
};

export function RadioButtons(props: RadioButtonsProps) {
  const el = Div({ styles: { display: 'flex' } });

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
        name: props.name,
        value: option,
        onchange: (e) => {
          props.onChange((e.target as HTMLInputElement).value);
        },
      },
      styles: { margin: '0 4px' },
    });
    el.appendChild(first);
    el.appendChild(firstLabel);
  });

  return el;
}
