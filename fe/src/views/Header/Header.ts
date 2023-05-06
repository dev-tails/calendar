import { Button, Div, P } from '../../components/elements';
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
  arePushNotificationsEnabled,
  checkPushNotificationsSupport,
  subscribeUser,
  unsubscribeUser,
} from '../../services/PushNotificationService';
import { getDateStringFromUrl } from '../../utils/dateHelpers';

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
  background: colors.mandarine,
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
  const windowPath = window.location.pathname;
  const pathSplit = windowPath.split('/');
  const eventId = pathSplit[pathSplit.length - 1]?.toString();

  const header = Div({
    styles: {
      height: '80px',
      backgroundColor: basics.whiteColor,
      boxShadow: '0px 4px 4px rgba(238, 238, 238, 0.25)',
      padding: '0 28px',
      ...flexAlignItemsCenter,
      justifyContent: 'flex-end',

      //not sure about this, added it last minute
      position: 'sticky',
      background: 'white',
      width: '100%',
      zIndex: '1',
      top: '0',
    },
  });

  const logo = Div({
    styles: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      cursor: 'pointer',
    },
    attr: { onclick: () => setURL('/') },
  });
  const image = document.createElement('img');
  image.src = '/assets/Logo.svg';
  const name = P({
    attr: { innerHTML: 'Zeit' },
    styles: {
      marginLeft: '12px',
      fontFamily: 'Poppins',
      fontSize: '18px',
    },
  });
  logo.append(image);
  logo.append(name);
  header.append(logo);

  const headerCTAButton = Button({
    selectors: { id: 'header-cta-btn' },
    attr: {
      innerHTML: isHome ? '' : 'Today',
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
    styles: isHome ? { display: 'none' } : todayButtonStyles,
  });
  header.append(headerCTAButton);

  if (showTopRightButton) {
    const rightButton = Button({
      selectors: { id: 'right-link' },
      attr: {
        innerHTML: 'Add event',
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
    if (window.location.pathname === '/') {
      setURL(`/add`);
    } else {
      setURL(`/add/${getDateStringFromUrl()}`);
    }
  }

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

  // checkPushNotificationsSupport() && header.append(pushNotificationsButton);
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
