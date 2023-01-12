import { Element, ElementAttributes, Selectors } from './Element';

type DivProps = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Div(props?: DivProps) {
  return Element({
    tag: 'div',
    ...props,
  });
}
