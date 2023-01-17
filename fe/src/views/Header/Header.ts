import { Button } from '../../components/elements/Button';
import { Div } from '../../components/elements/Div';
import {
  basics,
  colors,
  flexAlignItemsCenter,
  fonts,
} from '../../utils/styles';
import { setURL } from '../../utils/HistoryUtils';
import { isLoggedIn } from '../../apis/UserApi';
import { logOut } from '../../apis/AuthApi';
import { byId } from '../../utils/DOMutils';

const headerTopLeftButton = {
  home: '',
  day: 'Go to today',
  edit: '< Back',
  event: '< Back',
  add: 'Home',
};

const headerButtonStyles = {
  background: 'none',
  border: 'none',
  color: basics.darkCharcoal,
  fontFamily: fonts.montserrat,
  fontWeight: '400',
  fontSize: '14px',
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
      margin: '0 20px',
      ...flexAlignItemsCenter,
      justifyContent: 'space-between',
    },
  });

  const leftButton = Button({
    selectors: { id: 'left-link' },
    attr: {
      textContent: headerTopLeftButton[view],
      onclick: (e) => {
        e.preventDefault();
        onLeftButtonClick();
      },
      onmouseover: () => {
        const button = byId('left-link');
        if (button) {
          button.style.color = colors.royalBlueLight;
          button.style.textDecoration = 'underline';
        }
      },
      onmouseout: () => {
        const button = byId('left-link');
        if (button) {
          button.style.color = basics.darkCharcoal;
          button.style.textDecoration = 'none';
        }
      },
    },
    styles: headerButtonStyles,
  });
  showTopLeftButton && header.append(leftButton);

  const rightNavButtons = Div({ styles: { marginLeft: 'auto' } });
  if (showTopRightButton) {
    const rightButton = Button({
      selectors: { id: 'right-link' },
      attr: {
        textContent: isEvent ? 'Edit Event' : 'Add Event',
        onclick: (e) => {
          e.preventDefault();

          const nextURL = isEvent ? `/events/edit/${eventId}` : '/add';
          setURL(nextURL);
        },
        onmouseover: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = colors.royalBlueLight;
            button.style.textDecoration = 'underline';
          }
        },
        onmouseout: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = basics.darkCharcoal;
            button.style.textDecoration = 'none';
          }
        },
      },
      styles: {
        ...headerButtonStyles,
        marginLeft: 'auto',
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
