export function setURL(url: string) {
  history.pushState({}, '', url);
  window.dispatchEvent(new Event('popstate'));
}
