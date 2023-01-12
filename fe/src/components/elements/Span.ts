type Attributes = { id?: string; class?: string };

export function Span(attributes?: Attributes) {
  const span = document.createElement('span');

  for (const attribute in attributes) {
    const attr = attributes[attribute as keyof Attributes];
    attr && span.setAttribute(attribute, attr);
  }

  return span;
}
