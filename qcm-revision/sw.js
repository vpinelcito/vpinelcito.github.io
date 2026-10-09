const CACHE_NAME = 'qcm-app-shell-v1.12'; // Incrémentez ici à chaque mise à jour

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './qcm.html',
  './main.js',
  './qcm.js',
  './dexie.js',
  './style.css',
  './qcm.css',
  './manifest.json',
  './favicone_20x20.png',
  './icon-192.png',
  './icon-512.png',
  './tick.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(ASSETS_TO_CACHE.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Nettoyage de l\'ancien cache d\'interface :', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  if (requestUrl.includes('://://google.com')) {
    return;
  }

  // 🏆 ENTRAVE AU CACHE : Si l'iPhone cherche le fichier sw.js, on force TOUJOURS le réseau en premier
  if (requestUrl.includes('sw.js')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // STRATÉGIE CIBLÉE : On applique "ignoreSearch" UNIQUEMENT sur la page qcm.html
  const urlObject = new URL(requestUrl);
  const optionsMatch = urlObject.pathname.endsWith('qcm.html') ? { ignoreSearch: true } : {};

  event.respondWith(
    caches.match(event.request, optionsMatch).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).catch((err) => {
        console.warn(`[Service Worker] Réseau indisponible : ${requestUrl}`);
        return new Response('Connexion internet requise pour cette ressource.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});