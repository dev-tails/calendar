import { httpGet } from './Api';

let self: User | null = null;
let users: User[] | null = null;
let usersPromise: User[] | null = null;
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

export async function getUsers(): Promise<User[] | null> {
  try {
    if (!usersPromise) {
      usersPromise = await httpGet(`/api/users/`);
      console.log('userPromius', usersPromise);
    }

    const allUsers = await usersPromise;

    // bIsLoggedIn = true;
    return allUsers;
  } catch (err) {
    // bIsLoggedIn = false;
    return [];
  }
}
