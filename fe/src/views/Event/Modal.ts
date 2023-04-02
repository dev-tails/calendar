import { times } from '../../../public/assets/FontAwesomeIcons';
import { buttonStyles } from '../../../public/css/componentStyles';
import { byId } from '../../utils/DOMutils';
import { basics, colors } from '../../utils/styles';
import { Button, Div, Label } from '../../components/elements';

type ModalProps = {
  icon: string;
  label: string;
  options: string[];
  onClick: (response: string) => void;
};

export function Modal(props: ModalProps) {
  const router = document.getElementById('router');
  if (!router) return;

  const el = Div({
    selectors: { id: 'modal' },
    styles: {
      height: '100vh',
      width: '100vw',
      top: '0',
      left: '0',
      position: 'fixed',
      backgroundColor: '#303030ab',
    },
  });
  const modal = Div({
    styles: {
      padding: '24px',
      background: ' white',
      top: '25%',
      position: ' relative',
      maxWidth: '500px',
      width: '100%',
      margin: 'auto',
      borderRadius: ' 4px',
      boxShadow: '0px 4px 4px rgb(133 131 131 / 25%)',
    },
  });

  const text = Label({
    attr: {
      innerHTML: props.label,
    },
    styles: {
      display: 'block',
      textAlign: 'center',
    },
  });

  const cancelButton = Button({
    selectors: {
      id: 'close-modal-btn',
    },
    attr: {
      innerHTML: times,
      type: 'button',
      onclick: () => {
        el.remove();
      },
      onmouseover: () => {
        const button = byId('close-modal-btn');
        if (button) {
          button.style.color = colors.lightOrange;
        }
      },
      onmouseout: () => {
        const button = byId('close-modal-btn');
        if (button) {
          button.style.color = basics.silver;
        }
      },
    },
    styles: {
      display: 'block',
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      color: basics.silver,
      fontSize: '26px',
      padding: '0px',
    },
  });

  const icon = Div({
    attr: {
      innerHTML: props.icon,
    },
    styles: {
      height: '60px',
      background: colors.mandarine,
      width: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      margin: '20px auto',
      fontSize: '24px',
    },
  });

  const buttons = Div({
    styles: {
      padding: '12px 0',
      marginLeft: 'auto',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
  });

  const notifyButton = Button({
    selectors: { id: 'notify-btn' },
    attr: {
      textContent: props.options[0],
      type: 'submit',
      onclick: () => {
        props.onClick(props.options[0]);
      },
      onmouseover: () => {
        const button = byId('notify-btn');
        if (button) {
          button.style.opacity = '.9';
        }
      },
      onmouseout: () => {
        const button = byId('notify-btn');
        if (button) {
          button.style.opacity = '1';
        }
      },
    },
    styles: buttonStyles,
  });

  const continueButton = Button({
    selectors: { id: 'continue-btn' },
    attr: {
      textContent: props.options[1],
      type: 'button',
      onclick: () => {
        props.onClick(props.options[1]);
      },
      onmouseover: () => {
        const button = byId('continue-btn');
        if (button) {
          button.style.opacity = '.9';
        }
      },
      onmouseout: () => {
        const button = byId('continue-btn');
        if (button) {
          button.style.opacity = '1';
        }
      },
    },
    styles: {
      ...buttonStyles,
      backgroundColor: basics.spanishGray,
      marginLeft: '20px',
    },
  });

  buttons.append(notifyButton);
  buttons.append(continueButton);
  modal.append(cancelButton);
  modal.append(icon);
  modal.append(text);
  modal.append(buttons);
  el.append(modal);

  router.append(el);
}
