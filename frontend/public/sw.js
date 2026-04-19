/* ─── NursePrep Service Worker ──────────────────────────────────────────────
   Gère les notifications push même quand l'app est fermée.
   ─────────────────────────────────────────────────────────────────────────── */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

/* ── Réception d'une notification push ──────────────────────────────────── */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title   = data.title  || 'NursePrep';
  const options = {
    body:    data.body   || '',
    icon:    data.icon   || '/logo192.png',
    badge:   data.badge  || '/logo192.png',
    data:  { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ── Clic sur la notification → ouvre / focus l'app ─────────────────────── */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, focus
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Sinon ouvre un nouvel onglet
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
