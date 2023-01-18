import { initializeUserApi, isLoggedIn } from './apis/UserApi';
import { Router } from './views/Router';

async function run() {
  const root = document.getElementById('root');

  const self = await initializeUserApi();
  const isAuthenticated = isLoggedIn();

  if (root) {
    const router = Router(isAuthenticated, self);
    root.append(router);
  }
}

run();
