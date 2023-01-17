import { setStyle } from '../../utils/DOMutils';

export type Selectors = {
  id?: string;
  class?: string;
};

export type ElementAttributes = {
  className?: string;
  innerText?: string;
  innerHTML?: string;
  value?: string;
  name?: string;
  onchange?: (ev: Event) => void;
  onmouseover?: (ev: Event) => void;
  onmouseout?: (ev: Event) => void;
};

type ElementProps = {
  tag: string;
  attr?: ElementAttributes;
  selectors?: Selectors;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Element(props: ElementProps) {
  const el = document.createElement(props.tag);

  if (!props?.selectors && !props?.attr && !props?.styles) {
    return el;
  }

  const { selectors, attr, styles } = props;

  if (selectors) {
    for (const selector in selectors) {
      const attr = selectors[selector as keyof Selectors];
      attr && el.setAttribute(selector, attr);
    }
  }

  if (attr) {
    Object.keys(attr).forEach((key) => {
      (el as any)[key] = attr[key as keyof ElementAttributes];
    });
  }

  if (styles) {
    setStyle(el, styles);
  }

  return el;
}
