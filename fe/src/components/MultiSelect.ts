import { setStyle } from '../utils/DOMutils';

export function MultiSelect(
  optionEntries: [string, string][],
  onChange: () => void
) {
  const selectEl = document.createElement('select');
  setStyle(selectEl, {
    minHeight: '228px',
    minWidth: '100px',
    fontSize: '14px',
  });
  selectEl.multiple = true;
  selectEl.required = true;
  optionEntries.forEach(([key, value]) => {
    const option = document.createElement('option');
    option.value = key;
    option.innerText = value;
    option.style.padding = '8px';
    option.onchange = onChange;
    selectEl.appendChild(option);
  });
  return selectEl;
}
