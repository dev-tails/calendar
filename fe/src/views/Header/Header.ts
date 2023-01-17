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

  if (!isLoggedIn()) {
    const btnLogin = Button({
      attr: {
        textContent: 'login',
      },
    });
    header.append(btnLogin);

    btnLogin.addEventListener('click', async function (e) {
      e.preventDefault();
      const email = prompt('email');
      const password = prompt('password');

      const res = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.reload();
      }
    });
  }
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
    header.append(rightButton);
  }

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
