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

export function Header(
  view: 'home' | 'day' | 'edit' | 'event' | 'new',
  dateURL?: string
) {
  const isHome = view === 'home';
  const isEvent = view === 'event';
  const isEditEvent = view === 'edit';
  const newEvent = view === 'new';
  const showTopRightButton = !newEvent && !isEditEvent;
  const showTopLeftButton = !isHome;
  !isHome && !isEditEvent;
  const windowPath = window.location.pathname;
  const pathSplit = windowPath.split('/');
  const eventId = pathSplit[pathSplit.length - 1]?.toString();

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
  showTopLeftButton && header.append(leftButton);

  if (showTopRightButton) {
    const rightButton = Button({
      attr: {
        textContent: isEvent ? 'Edit Event' : 'Add Event',
        onclick: (e) => {
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

  console.log('current view', view, dateURL);
  function onLeftButtonClick() {
    let nextURL = '/';
    if (isEvent) {
      nextURL = `/day/${dateURL}`;
    }
    if (isEditEvent) {
      nextURL = `/events/${eventId}`;
    }

    setURL(nextURL);
  }

  return header;
}
