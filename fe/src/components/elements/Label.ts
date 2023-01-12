import { Element, ElementAttributes } from './Element';

type Selectors = {
  id?: string;
  class?: string;
};

interface LabelAttributes extends ElementAttributes {
  for?: string;
}

type LabelProps = {
  selectors?: Selectors;
  attr?: LabelAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Label(props?: LabelProps) {
  return Element({
    tag: 'label',
    ...props,
  });
}
