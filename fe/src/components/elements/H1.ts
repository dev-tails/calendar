import { Element, ElementAttributes, Selectors } from './Element';

type H1Props = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function H1(props: H1Props) {
  return Element({
    tag: 'h1',
    ...props,
  });
}
