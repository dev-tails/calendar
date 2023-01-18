import { httpGet } from './Api';

let self: User | null = null;
let loggedIn = false;

export async function initializeUserApi() {
  self = await fetchSelf();
  return self;
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
