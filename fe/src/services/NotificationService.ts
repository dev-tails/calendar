let notificationsEnabled = false;

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}

export function initializeNotificationService() {
  notificationsEnabled = localStorage.getItem('notifications') === 'true';

  if (!('Notification' in window)) {
    return;
  }

  const isNotificationsPromiseSupported = checkNotificationPromise();

  if (!isNotificationsPromiseSupported) {
    /* Safari does not support the promise-based version */
    Notification.requestPermission();
  }
}

export function areNotificationsEnabled() {
  return notificationsEnabled;
}

export function toggleNotificationsEnabled() {
  notificationsEnabled = !notificationsEnabled;

  localStorage.setItem(
    'notifications',
    notificationsEnabled ? 'true' : 'false'
  );
}
