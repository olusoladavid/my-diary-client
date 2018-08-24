/* eslint-disable no-restricted-globals */

const processPushMessage = (e) => {
  const title = 'What\'s on your mind today?';
  const options = {
    body: 'Time to update your diary',
    icon: '/img/favicon.png',
  };
  const notificationDisplayed = self.registration.showNotification(title, options);
  e.waitUntil(notificationDisplayed);
};

const openWindow = (evt) => {
  evt.notification.close();

  evt.waitUntil(clients.matchAll({
    type: 'window',
  }).then((openClients) => {
    // see if a window or tab of webpage is already open and activate
    for (let i = 0; i < openClients.length; i += 1) {
      const client = openClients[i];
      if (client.url === '/new-story.html' && 'focus' in client) return client.focus();
    }
    // if not, open a new window
    if (clients.openWindow) {
      return clients.openWindow('/new-story.html');
    }
  }));
};

self.addEventListener('push', processPushMessage);
self.addEventListener('notificationclick', openWindow);
/* eslint-enable no-restricted-globals */
