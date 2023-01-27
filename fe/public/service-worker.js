self.addEventListener('push', (e) => {
  if (e.data) {
    // const data = e.data.json();
    const notificationPromise = self.registration.showNotification(
      'my title here',
      {
        body: "Push notification from me it's mariooooo",
        actions: [
          {
            action: 'open',
            title: 'Open calendar',
          },
          {
            action: 'close',
            title: 'Close notification',
          },
        ],
        tag: 'event',
        renotify: true,
      }
    );

    e.waitUntil(notificationPromise);
  } else {
    console.log('Push event but no data');
  }
});

// self.addEventListener('install', (event) => {
//   console.log('service worker install event');
// });

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.');

  // event.notification.close();
  if (event.action === 'close') {
    event.notification.close();
  } else {
    // self.clients.openWindow('/');
    // }

    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients.length) {
          // check if at least one tab is already open
          clients[0].focus();
        } else {
          self.clients.openWindow('/');
        }
      })
    );
  }
});
