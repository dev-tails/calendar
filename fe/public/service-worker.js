self.addEventListener('push', (e) => {
  if (e.data) {
    const data = e.data.json();
    const notificationPromise = self.registration.showNotification(data.title, {
      body: data.body,
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
    });

    e.waitUntil(notificationPromise);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

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
