import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { basics, flexAlignItemsCenter, fonts } from '../../utils/styles';
import { onClick } from '../../utils/DOMutils';
import { setURL } from '../../utils/HistoryUtils';

const headerTopLeftButton = {
  home: '',
  day: 'Go to today',
  edit: '< Back',
  event: '< Back',
  new: 'Home',
};

export function Header(view: 'home' | 'day' | 'edit' | 'event' | 'new') {
  const isHome = view === 'home';
  const isEvent = view === 'event';
  const isEditEvent = view === 'edit';
  const newEvent = view === 'new';
  const showRightSideButton = !newEvent && !isEditEvent;

  const header = Div({
    styles: {
      height: '80px',
      backgroundColor: basics.whiteColor,
      boxShadow: '0px 4px 4px rgba(238, 238, 238, 0.25)',
      margin: '12px 20px',
      ...flexAlignItemsCenter,
      justifyContent: 'space-between',
    },
  });

  const leftButton = Button({
    attr: {
      textContent: headerTopLeftButton[view],
      onclick: (e) => {
        e.preventDefault();
        onLeftButtonClick();
      },
    },
  });
  !isHome && header.append(leftButton);

  if (showRightSideButton) {
    const rightButton = Button({
      attr: {
        textContent: isEvent ? 'Edit Event' : 'Add Event',
        onclick: (e) => {
          const windowPath = window.location.pathname;
          const pathSplit = windowPath.split('/');
          const eventId = pathSplit[pathSplit.length - 1]?.toString();

          e.preventDefault();
          const nextURL = isEvent ? `/events/edit/${eventId}` : '/new';
          setURL(nextURL);
        },
      },
      styles: {
        marginLeft: 'auto',
      },
    });
    header.append(rightButton);
  }

  function onLeftButtonClick() {
    return isEvent ? () => history.back() : () => setURL(`/`);
  }

  return header;
}
