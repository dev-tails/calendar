import { httpGet } from './Api';

type User = {
  _id: string;
  name: string;
  color: string;
};

let self: User | null = null;
let loggedIn = false;

export async function initializeUserApi() {
  self = await fetchSelf();
}

export function isLoggedIn() {
  return loggedIn;
}

export async function fetchSelf() {
  try {
    const user = await httpGet<User>('/api/users/self');

    loggedIn = user ? true : false;
    return user;
  } catch (err) {
    loggedIn = false;
    return null;
  }
}
