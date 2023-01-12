import { Element, ElementAttributes, Selectors } from './Element';

interface ButtonAttributes extends ElementAttributes {
  type?: 'button' | 'submit';
  textContent: string;
  onclick?: (e?: any) => void;
}

type ButtonProps = {
  attr?: ButtonAttributes;
  selectors?: Selectors;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Button(props?: ButtonProps) {
  return Element({
    tag: 'button',
    ...props,
  });
}
