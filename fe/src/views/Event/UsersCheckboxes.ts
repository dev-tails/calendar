import { fetchSelf, getUsers } from '../../apis/UserApi';
import { Div } from '../../components/elements/Div';
import { Input } from '../../components/elements/Input/Input';
import { Label } from '../../components/elements/Label';

export function UsersCheckboxes(
  id: string,
  selectedUserIds: string[],
  onChange: (option: string[]) => void
) {
  const checkboxEl = Div({ selectors: { id } });

  async function init() {
    const currentUser = await fetchSelf();
    const users = await getUsers();

    const isPrivateEvent =
      selectedUserIds?.length === 1 && selectedUserIds[0] === currentUser?._id;
    const everyone = !selectedUserIds.length;

    let selectedIds =
      isPrivateEvent || everyone
        ? users.map((user) => user._id)
        : selectedUserIds;

    users.forEach((option) => {
      const optionContainer = Div();
      const { name, _id } = option;

      const optionLabel = Label({
        attr: { innerText: name, for: name },
      });

      const optionEl = Input({
        selectors: {
          id: _id,
        },
        attr: {
          type: 'checkbox',
          disabled: currentUser?._id === _id,
          checked: selectedIds.includes(_id),
          value: name,
          onchange: (e: Event) => {
            const isChecked = (e.target as HTMLInputElement).checked;

            if (isChecked) {
              selectedIds.push(_id);
            } else {
              selectedIds = selectedIds.filter(
                (optionSelected) => optionSelected !== _id
              );
            }
            const everyoneSelected = selectedIds.length === users.length;

            onChange(everyoneSelected ? [] : selectedIds);
          },
        },
      });

      optionContainer.appendChild(optionEl);
      optionContainer.appendChild(optionLabel);
      checkboxEl.appendChild(optionContainer);
    });
  }
  init();
  return checkboxEl;
}
