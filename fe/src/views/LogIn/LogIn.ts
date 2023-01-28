import { logIn } from '../../apis/AuthApi';
import { Button, Div, Form, Input } from '../../components/elements/index';

export function LogIn() {
  let logInState = {
    email: '',
    password: '',
  };

  const form = Form({
    styles: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      margin: '40px',
    },
  });

  const email = formInput('email');
  const password = formInput('password');

  const error = Div({
    attr: {
      innerText: 'Please provide correct email and password.',
    },
  });

  const submitBtn = Button({
    attr: {
      type: 'submit',
      textContent: 'submit',
      onclick: async (e) => {
        e.preventDefault();
        try {
          await logIn(logInState);
          window.location.reload();
        } catch (err) {
          form.appendChild(error);
        }
      },
    },
  });

  form.appendChild(email);
  form.appendChild(password);
  form.appendChild(submitBtn);

  function formInput(field: keyof typeof logInState) {
    return Input({
      attr: {
        name: field,
        placeholder: field,
        type: field === 'password' ? 'password' : 'text',
        onchange: (e) => {
          logInState[field] = (e.target as HTMLInputElement).value;
        },
      },
    });
  }

  return form;
}
