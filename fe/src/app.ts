import { initializeUserApi, isLoggedIn } from './apis/UserApi';
import { Router } from './views/Router';
import { initializePushNotificationService } from './services/PushNotificationService';

async function run() {
  const root = document.getElementById('root');

  await Promise.all([initializePushNotificationService(), initializeUserApi()]);
  const isAuthenticated = isLoggedIn();

  if (root) {
    const router = Router(isAuthenticated);
    root.append(router);
  }
}

run();
