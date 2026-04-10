// sw.js - Service Worker para Android
self.addEventListener('install', (event) => {
  // Fuerza al Service Worker a activarse inmediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Toma el control de la página inmediatamente
  event.waitUntil(clients.claim());
});

// Escucha cuando el usuario hace clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Cierra la notificación
  
  // Si la app está abierta, pone el foco en ella; si no, la abre
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./index.html');
    })
  );
});

// Maneja eventos push si en el futuro decides enviarlos
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "GymBro";
  const options = {
    body: data.body || "¡Tiempo de descanso terminado!",
    icon: "icon-192.png",
    vibrate: [200, 100, 200],
    badge: "icon-192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
