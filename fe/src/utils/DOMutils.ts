export function byId(id: string) {
  return document.getElementById(id);
}

export function setStyle(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  for (const key of Object.keys(styles)) {
    const elementKey = key as unknown as number;
    const stylesKey = styles[key as unknown as number];
    if (stylesKey) el.style[elementKey] = stylesKey;
  }
}

export function onClick(el: HTMLElement, handler: (event: MouseEvent) => void) {
  return el.addEventListener('click', handler, true);
}
