import { setStyle } from '../../utils/DOMutils';

type HeaderProps = {
  headerType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  text: string;
  styles?: Partial<CSSStyleDeclaration>;
};

export function Header(props: HeaderProps) {
  const headerEl = document.createElement(props.headerType);

  headerEl.innerText = props.text;

  if (props.styles) {
    setStyle(headerEl, props.styles);
  }

  return headerEl;
}
