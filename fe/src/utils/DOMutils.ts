export function byId(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    throw Error(`No element with id ${id}`);
  }
  return el;
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

export function onKeydown(
  el: HTMLElement | Document,
  handler: (eventListener: KeyboardEvent) => void
) {
  return el.addEventListener('keydown', handler as any, { once: true });
}
