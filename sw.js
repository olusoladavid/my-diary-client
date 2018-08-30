/* eslint-disable no-restricted-globals */

const processPushMessage = async (pushEvt) => {
  const message = await pushEvt.data.json();
  const { title, body, tag } = message;
  const options = {
    body,
    tag,
    requireInteraction: true,
    icon: './img/favicon.png',
  };
  return self.registration.showNotification(title, options);
};

const openWindow = async () => {
  const openClients = await clients.matchAll({ type: 'window' });
  const reusableClient = openClients.find(client => client.url === './new-story.html' && 'focus' in client);
  if (reusableClient) {
    return reusableClient.focus();
  }
  return clients.openWindow('./new-story.html');
};

self.addEventListener('push', (evt) => {
  const evtClone = evt;
  evt.waitUntil(processPushMessage(evtClone));
});
self.addEventListener('notificationclick', (evt) => {
  evt.notification.close();
  evt.waitUntil(openWindow());
});

/* eslint-enable no-restricted-globals */
