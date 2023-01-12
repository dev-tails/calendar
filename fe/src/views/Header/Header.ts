import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { basics, flexAlignItemsCenter, fonts } from '../../utils/styles';
import { onClick } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';

const headerTopLeftButton = {
  home: '',
  day: 'Go to today',
  edit: '< Back', //hide edit until I get back to edit event view
  event: '< Back',
  new: 'Home',
};

export function Header(view: 'home' | 'day' | 'edit' | 'event' | 'new') {
  const isHome = view === 'home';
  const isEvent = view === 'event';
  const isEditEvent = view === 'edit';
  const newEvent = view === 'new';

  const windowPath = window.location.pathname;
  const pathSplit = windowPath.split('/');
  const eventId = pathSplit[pathSplit.length - 1]?.toString();

  const el = Div({
    styles: {
      height: '80px',
      backgroundColor: basics.whiteColor,
      boxShadow: '0px 4px 4px rgba(238, 238, 238, 0.25)',
      margin: '12px 20px',
      ...flexAlignItemsCenter,
      justifyContent: 'space-between',
    },
  });

  const onLeftButtonClick = isEvent ? () => history.back() : () => setURL(`/`);
  const leftButton = Button({
    attr: {
      textContent: headerTopLeftButton[view],
      onclick: (e) => {
        e.preventDefault();
        onLeftButtonClick();
      },
    },
  });
  !isHome && el.append(leftButton);

  if (!isEditEvent && !newEvent) {
    const rightButton = Button({
      attr: {
        textContent: 'Add Event',
        onclick: (e) => {
          e.preventDefault();
          setURL('/new');
        },
      },
      styles: {
        marginLeft: 'auto',
      },
    });
    el.append(rightButton);
  }

  return el;
}
