import { Element, ElementAttributes, Selectors } from './Element';

interface TextareaAttributes extends ElementAttributes {
  placeholder?: string;
  required?: boolean;
}

type TextareaProps = {
  attr?: TextareaAttributes;
  selectors?: Selectors;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Textarea(props?: TextareaProps) {
  return Element({
    tag: 'textarea',
    ...props,
  });
}
