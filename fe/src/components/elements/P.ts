import { Element, ElementAttributes, Selectors } from './Element';

type PProps = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function P(props?: PProps) {
  return Element({
    tag: 'p',
    ...props,
  });
}
