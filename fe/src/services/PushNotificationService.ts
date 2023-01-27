import {
  deleteSubscription,
  getPublicKey,
  saveSubscription,
} from '../apis/PushNotificationApi';

let isSubscribed = false;
let serviceWorker: ServiceWorkerRegistration;

export async function initializePushNotificationService() {
  if (!checkPushNotificationsSupport) {
    console.error('Push notifications are not supported');
    return;
  }

  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      '/service-worker.js'
    );
    serviceWorker = serviceWorkerRegistration;
    init();
  } catch (err) {
    console.error('Service worker error', err);
  }
}

export function checkPushNotificationsSupport() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

async function init() {
  try {
    const subscription = await serviceWorker.pushManager.getSubscription();
    isSubscribed = !(subscription === null);
  } catch (err) {
    console.error(err);
  }
}

export async function subscribeUser() {
  const applicationServerKey = urlBase64ToUint8Array(await getPublicKey());

  try {
    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });
    updateSubscriptionOnServer(subscription);
    isSubscribed = true;
  } catch (err) {
    console.error('Failed to subscribe the user: ', err);
  }
}

export async function unsubscribeUser() {
  try {
    const subscription = await serviceWorker.pushManager.getSubscription();
    await subscription?.unsubscribe();
    await updateSubscriptionOnServer(null);
    isSubscribed = false;
  } catch (err) {
    console.log('Error unsubscribing', err);
  }
}

async function updateSubscriptionOnServer(subscription: any) {
  subscription
    ? await saveSubscription(subscription)
    : await deleteSubscription();
}

function urlBase64ToUint8Array(base64String: any) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function arePushNotificationsEnabled() {
  return isSubscribed;
}
