import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import { basics, flexAlignItemsCenter } from '../../utils/styles';
import { setURL } from '../../utils/HistoryUtils';
import { isLoggedIn } from '../../apis/UserApi';
import { logOut } from '../../apis/AuthApi';

const headerTopLeftButton = {
  home: '',
  day: 'Go to today',
  edit: '< Back',
  event: '< Back',
  add: 'Home',
};

export function Header(
  view: 'home' | 'day' | 'edit' | 'event' | 'add',
  dateURL?: string
) {
  const isHome = view === 'home';
  const isEvent = view === 'event';
  const isEditEvent = view === 'edit';
  const isAddEvent = view === 'add';
  const showTopRightButton = !isAddEvent && !isEditEvent;
  const showTopLeftButton = !isHome;
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

  const rightNavButtons = Div({ styles: { marginLeft: 'auto' } });
  if (showTopRightButton) {
    const rightButton = Button({
      attr: {
        textContent: isEvent ? 'Edit Event' : 'Add Event',
        onclick: (e) => {
          e.preventDefault();

          const nextURL = isEvent ? `/events/edit/${eventId}` : '/add';
          setURL(nextURL);
        },
      },
    });
    rightNavButtons.append(rightButton);
  }

  const logoutButton = Button({
    attr: {
      textContent: 'Log out',
      onclick: (e) => {
        e.preventDefault();
        try {
          logOut();
          window.location.reload();
        } catch (err) {
          console.error('Unable to log out');
          alert('Unable to log out');
        }
      },
    },
    styles: {
      marginLeft: '20px',
    },
  });

  isLoggedIn() && rightNavButtons.append(logoutButton);
  header.appendChild(rightNavButtons);

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
