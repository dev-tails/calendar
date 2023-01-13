import { Element, ElementAttributes, Selectors } from './Element';

type SpanProps = {
  selectors?: Selectors;
  attr?: ElementAttributes;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Span(props?: SpanProps) {
  return Element({
    tag: 'span',
    ...props,
  });
}
