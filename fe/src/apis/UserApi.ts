import { httpGet } from './Api';

let self: User | null = null;
let selfPromise: User | null = null;

let users: User[] | null = null;
let usersPromise: User[] | null = null;

let loggedIn = false;

export async function initializeUserApi() {
  self = await fetchSelf();
  users = await getUsers();
}

export function isLoggedIn() {
  return loggedIn;
}

export async function fetchSelf() {
  try {
    if (!selfPromise) {
      selfPromise = await httpGet(`/api/users/self`);
    }
    const user = selfPromise;

    return user;
  } catch (err) {
    loggedIn = false;
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    if (!usersPromise) {
      usersPromise = await httpGet(`/api/users/`);
    }

    const allUsers = usersPromise || [];

    loggedIn = true;
    return allUsers;
  } catch (err) {
    loggedIn = false;
    return [];
  }
}
