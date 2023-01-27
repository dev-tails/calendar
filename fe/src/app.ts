import { initializeUserApi, isLoggedIn } from './apis/UserApi';
import { Router } from './views/Router';
import { initializePushNotificationService } from './services/PushNotificationService';
import { initializeNotificationService } from './services/NotificationService';

async function run() {
  const root = document.getElementById('root');

  await Promise.all([
    initializeNotificationService(),
    initializePushNotificationService(),
    initializeUserApi(),
  ]);
  const isAuthenticated = isLoggedIn();

  if (root) {
    const router = Router(isAuthenticated);
    root.append(router);
  }
}

run();
