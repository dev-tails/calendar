import { Element, ElementAttributes, Selectors } from '../Element';

interface InputAttributes extends ElementAttributes {
  checked?: boolean;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  type?:
    | 'text'
    | 'date'
    | 'time'
    | 'checkbox'
    | 'datetime-local'
    | 'password'
    | 'radio';
  value?: string;
  onkeyup?: (e: KeyboardEvent) => void;
}

type InputProps = {
  attr?: InputAttributes;
  selectors?: Selectors;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Input(props?: InputProps) {
  return Element({
    tag: 'input',
    ...props,
  });
}
