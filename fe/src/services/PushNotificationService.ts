// import { getPublicKey } from '../apis/PushNotificationApi';
// import { areNotificationsEnabled } from './NotificationService';
// const check = () => {
//   // if (!('serviceWorker' in navigator)) {
//   //   throw new Error('No Service Worker support!');
//   // }
//   // if (!('PushManager' in window)) {
//   //   throw new Error('No Push API Support!');
//   // }
// };

import { getPublicKey } from '../apis/PushNotificationApi';
import { byId } from '../utils/DOMutils';

export function initializePushNotificationService() {
  //   check();
  //   //check if servce worker is enabled in the current browser and trigger the send method below where we register the service worker and then trigger the send notification functionality
  //   try {
  //     if ('serviceWorker' in navigator) {
  //       registerServiceWorker().catch((err) => console.error(err));
  //     }

  //     //register the service worker, register our push api, send the notification
  //     async function registerServiceWorker() {
  //       //register service worker
  //       const register = await navigator.serviceWorker.register(
  //         '/service-worker.js'
  //       );

  //       const subscription = await register.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: urlBase64ToUint8Array(await getPublicKey()),
  //       });
  //       console.log('subscription', subscription);
  //       //saveSubscription saves the subscription to the backend
  //       const response = await fetch('/api/subscriptions', {
  //         method: 'POST',
  //         body: JSON.stringify(subscription),
  //         headers: {
  //           'content-type': 'application/json',
  //         },
  //       });
  //       console.log('response', response);
  //       return response.json();
  //     }
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // }

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

  let swRegistration: any;
  let isSubscribed = false;
  const pushButton = byId('pushButton') as HTMLButtonElement;

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push are supported');

    navigator.serviceWorker
      .register('service-worker.js')
      .then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
      })
      .catch(function (error) {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }

  function initializeUI() {
    pushButton.addEventListener('click', function () {
      pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
      }
    });

    // Set the initial subscription value
    swRegistration.pushManager
      .getSubscription()
      .then(function (subscription: any) {
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('User IS subscribed.');
        } else {
          console.log('User is NOT subscribed.');
        }

        updateBtn();
      });
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
  }

  async function subscribeUser() {
    const applicationServerKey = urlBase64ToUint8Array(await getPublicKey());
    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then(function (subscription: any) {
        console.log('User is subscribed.');

        updateSubscriptionOnServer(subscription);

        isSubscribed = true;

        updateBtn();
      })
      .catch(function (err: any) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn();
      });
  }

  function unsubscribeUser() {
    swRegistration.pushManager
      .getSubscription()
      .then(function (subscription: any) {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(function (error: any) {
        console.log('Error unsubscribing', error);
      })
      .then(function () {
        updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateBtn();
      });
  }
}

async function updateSubscriptionOnServer(subscription: any) {
  // TODO: Send subscription to application server

  if (subscription) {
    console.log(JSON.stringify(subscription), 'is visible');
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json',
      },
    });
    console.log('response', response);
    return response.json();
  } else {
    console.log('is-invisible');
  }
}
