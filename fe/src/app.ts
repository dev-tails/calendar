import { initializeUserApi, isLoggedIn } from './apis/UserApi';
import { Router } from './views/Router';

async function run() {
  const root = document.getElementById('root');

  await initializeUserApi();
  const isAuthenticated = isLoggedIn();

  if (root) {
    const router = Router(isAuthenticated);
    root.append(router);
  }
}

run();
