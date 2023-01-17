export const logInApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
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
