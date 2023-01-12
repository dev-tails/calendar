type CheckboxInputProps = {
  id?: string;
  checked: boolean;
  onchange: () => void;
};

export function CheckboxInput(props?: CheckboxInputProps) {
  const input = document.createElement('input');
  input.type = 'checkbox';

  if (props) {
    Object.keys(props).forEach((key) => {
      const propsKey = key as keyof CheckboxInputProps;
      (input as any)[propsKey] = props[propsKey];
    });
  }

  return input;
}
