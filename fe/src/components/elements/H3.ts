import { Element, ElementAttributes, Selectors } from './Element';

type H3Props = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function H3(props: H3Props) {
  return Element({
    tag: 'h3',
    ...props,
  });
}
