import { Element, ElementAttributes, Selectors } from './Element';

type FormProps = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Form(props?: FormProps) {
  return Element({
    tag: 'form',
    ...props,
  });
}
