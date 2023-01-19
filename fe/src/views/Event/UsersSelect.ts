import { inputStyles } from '../../../public/css/componentStyles';
import { getUsers } from '../../apis/UserApi';
import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { MultiSelect } from '../../components/MultiSelect';
import { byId } from '../../utils/DOMutils';

export function UsersSelect(id: string) {
  let userEntries: any = [];
  const el = Div({ selectors: { id }, styles: { padding: '12px 0' } });
  async function init() {
    const users = await getUsers();
    users?.forEach((user) => {
      userEntries?.push({ id: user._id, name: user.name });
    });

    const selectEl = MultiSelect(userEntries, (e) => console.log('e', e));
    // el.appendChild(selectEl);

    const inputSearch = Div({
      selectors: { id: 'input-search' },
      styles: {
        position: 'absolute',
        backgroundColor: '#f6f6f6',
        minWidth: '230px',
        overflow: 'auto',
        zIndex: '1',
      },
    });
    const input = Input({
      selectors: { id: 'myInput' },
      attr: { placeholder: 'Search user', onkeyup: filterFunction },
      styles: { ...inputStyles, width: '230px' },
    });

    users?.map((user) => {
      const userOption = Div({
        attr: { innerHTML: user.name },
        styles: {
          display: 'none',
          color: 'black',
          padding: '12px 16px',
          textDecoration: 'none',
        },
      });
      inputSearch.appendChild(userOption);
    });

    el.appendChild(input);
    el.appendChild(inputSearch);

    function myFunction() {
      byId('input-search')?.classList.toggle('show');
    }

    function filterFunction(e: KeyboardEvent) {
      const arrowDownKey = e.key === 'ArrowDown';
      const input = byId('myInput');
      const typedInput = (input as HTMLInputElement).value.toLowerCase();
      const dropdown = byId('input-search');

      if (!dropdown) {
        return;
      }

      dropdown.style.display = typedInput || arrowDownKey ? '' : 'none';
      const options = dropdown?.getElementsByTagName('div');

      if (options?.length) {
        Array.from(options).forEach((option) => {
          const textValue = option.innerText;
          const match = textValue.toLowerCase().indexOf(typedInput) > -1;
          option.style.display = match ? 'block' : 'none';
          option.onclick = () => console.log('option', option);
        });
      }
    }
  }

  init();

  return el;
}
