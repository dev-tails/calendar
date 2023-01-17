import { initializeUserApi } from './apis/UserApi';
import { Router } from './views/Router';

async function run() {
  const root = document.getElementById('root');

  await initializeUserApi();
  if (root) {
    const router = Router();
    root.append(router);
  }
}

run();
