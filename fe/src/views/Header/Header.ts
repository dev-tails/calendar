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
  day: 'Today',
  edit: '< Back',
  event: '< Back',
  add: 'Home',
};

const headerButtonStyles = {
  background: 'none',
  border: 'none',
  color: colors.royalBlueLight,
  fontFamily: fonts.montserrat,
  fontWeight: '400',
  fontSize: '14px',
  marginLeft: '20px',
};

const todayButtonStyles = {
  ...headerButtonStyles,
  borderRadius: '4px',
  background: colors.royalBlueLight,
  color: basics.whiteColor,
  padding: '8px 12px',
};

export function Header(
  view: 'home' | 'day' | 'edit' | 'event' | 'add',
  dateURL?: string
) {
  const isHome = view === 'home';
  const isEvent = view === 'event';
  const isEditEvent = view === 'edit';
  const isAddEvent = view === 'add';
  const isDay = view === 'day';
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
      justifyContent: 'flex-end',
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
          button.style.color = isDay ? basics.whiteColor : colors.mandarine;
          button.style.opacity = isDay ? '.8' : '';
        }
      },
      onmouseout: () => {
        const button = byId('left-link');
        if (button) {
          button.style.color = isDay
            ? basics.whiteColor
            : colors.royalBlueLight;
          button.style.opacity = isDay ? '1' : '';
        }
      },
    },
    styles: isDay
      ? todayButtonStyles
      : { ...headerButtonStyles, marginRight: 'auto' },
  });
  showTopLeftButton && header.append(leftButton);

  if (showTopRightButton) {
    const rightButton = Button({
      selectors: { id: 'right-link' },
      attr: {
        textContent: isEvent ? 'Edit event' : 'Add event',
        onclick: (e) => {
          e.preventDefault();

          const nextURL = isEvent ? `/events/edit/${eventId}` : '/add';
          setURL(nextURL);
        },
        onmouseover: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = colors.mandarine;
          }
        },
        onmouseout: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = colors.royalBlueLight;
          }
        },
      },
      styles: headerButtonStyles,
    });
    header.append(rightButton);
  }

  const logoutButton = Button({
    selectors: {
      id: 'logout',
    },
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
      onmouseover: () => {
        const button = byId('logout');
        if (button) {
          button.style.color = colors.mandarine;
        }
      },
      onmouseout: () => {
        const button = byId('logout');
        if (button) {
          button.style.color = colors.royalBlueLight;
        }
      },
    },
    styles: headerButtonStyles,
  });

  isLoggedIn() && header.append(logoutButton);

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
