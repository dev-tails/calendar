import { setStyle } from '../utils/DOMutils';

export function MultiSelect(
  optionEntries: any[],
  onChange: (option: any) => void
) {
  const selectEl = document.createElement('select');
  setStyle(selectEl, {
    minHeight: '228px',
    minWidth: '100px',
    fontSize: '14px',
  });
  selectEl.multiple = true;
  selectEl.required = true;
  console.log('option entries', optionEntries);
  optionEntries.forEach((option) => {
    const { name, id } = option;
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.innerText = name;
    optionEl.style.padding = '8px';
    optionEl.onselect = onChange;
    selectEl.appendChild(optionEl);
  });
  return selectEl;
}
