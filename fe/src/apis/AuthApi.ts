type LogInParams = {
  email: string;
  password: string;
};

export const logIn = async ({ email, password }: LogInParams) => {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    return !!res.ok;
  } else {
    throw new Error('Incorrect credentials.');
  }
};

export const logOut = async () => {
  const res = await fetch('/api/users/logout');

  if (res.ok) {
    return !!res.ok;
  } else {
    throw new Error('Unable to log out.');
  }
};
