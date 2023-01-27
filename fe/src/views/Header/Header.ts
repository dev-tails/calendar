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
import { chevronLeft, home } from '../../../public/assets/FontAwesomeIcons';
import {
  areNotificationsEnabled,
  toggleNotificationsEnabled,
} from '../../services/NotificationService';
import {
  arePushNotificationsEnabled,
  checkPushNotificationsSupport,
  subscribeUser,
  unsubscribeUser,
} from '../../services/PushNotificationService';

const headerTopLeftButton = {
  home: '',
  day: 'Today',
  edit: `${chevronLeft} Back`,
  event: `${chevronLeft} Back`,
  add: home,
};

const headerTopRightButton = {
  home: 'Add event',
  day: 'Add event',
  edit: home,
  event: 'Add event',
  add: home,
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
  const showTopRightButton = !isAddEvent;
  const showTopLeftButton = !isHome;
  const windowPath = window.location.pathname;
  const pathSplit = windowPath.split('/');
  const eventId = pathSplit[pathSplit.length - 1]?.toString();

  const header = Div({
    styles: {
      height: '80px',
      backgroundColor: basics.whiteColor,
      boxShadow: '0px 4px 4px rgba(238, 238, 238, 0.25)',
      padding: '0 20px',
      ...flexAlignItemsCenter,
      justifyContent: 'flex-end',
    },
  });

  const leftButton = Button({
    selectors: { id: 'left-link' },
    attr: {
      innerHTML: headerTopLeftButton[view],
      onclick: (e) => {
        e.preventDefault();
        onLeftButtonClick();
      },
      onmouseover: () => {
        const button = byId('left-link');
        if (button) {
          button.style.opacity = isDay ? '.9' : '';
        }
      },
      onmouseout: () => {
        const button = byId('left-link');
        if (button) {
          button.style.opacity = isDay ? '1' : '';
        }
      },
    },
    styles: isDay
      ? todayButtonStyles
      : {
          ...headerButtonStyles,
          marginRight: isAddEvent ? '' : 'auto',
          marginLeft: 'none',
          fontSize: isAddEvent ? '20px' : '',
        },
  });
  showTopLeftButton && header.append(leftButton);

  if (showTopRightButton) {
    const rightButton = Button({
      selectors: { id: 'right-link' },
      attr: {
        innerHTML: headerTopRightButton[view],
        onclick: (e) => {
          e.preventDefault();

          onRightButtonClick();
        },
        onmouseover: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = '#9da8d2';
          }
        },
        onmouseout: () => {
          const button = byId('right-link');
          if (button) {
            button.style.color = colors.royalBlueLight;
          }
        },
      },
      styles: {
        ...headerButtonStyles,
        fontSize: isEditEvent || isAddEvent ? '20px' : '14px',
      },
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
          console.error('Unable to log out.');
        }
      },
      onmouseover: () => {
        const button = byId('logout');
        if (button) {
          button.style.color = '#9da8d2';
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

  function onRightButtonClick() {
    let nextURL = '/';
    if (isHome || isDay || isEvent) {
      nextURL = '/add';
    }
    setURL(nextURL);
  }

  function notificationsBtnText() {
    return `${areNotificationsEnabled() ? 'Disable' : 'Allow'} notifications`;
  }

  const toggleNotifications = Button({
    attr: {
      type: 'button',
      innerHTML: notificationsBtnText(),
      onclick: () => {
        toggleNotificationsEnabled();
        toggleNotifications.innerHTML = notificationsBtnText();
      },
    },
  });

  const pushNotificationsButton = Button({
    selectors: { id: 'pushButton' },
    attr: {
      type: 'button',
      innerHTML: buttonText(),
      disabled: buttonText() === 'Push notifications blocked',
      onclick: async (e) => {
        e.preventDefault();
        pushNotificationsButton.disabled = true;

        arePushNotificationsEnabled()
          ? await unsubscribeUser()
          : await subscribeUser();

        pushNotificationsButton.innerHTML = buttonText();
        pushNotificationsButton.disabled = false;
      },
    },
  });

  checkPushNotificationsSupport() && header.append(pushNotificationsButton);
  // header.append(toggleNotifications);
  return header;
}

function buttonText() {
  if (Notification.permission === 'denied') {
    unsubscribeUser();
    return 'Push notifications blocked';
  }
  return `${
    arePushNotificationsEnabled() ? 'Disable ' : 'Enable '
  } push notifications`;
}
