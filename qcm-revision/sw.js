const CACHE_NAME = 'qcm-app-shell-v0.9'; // Incrémenté à 0.9 pour forcer la mise à jour sur ton navigateur

// Liste corrigée avec les bons fichiers CSS et JS présents dans ton dépôt
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
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Utilisation de Promise.allSettled pour éviter qu'un seul fichier manquant bloque tout
      Promise.allSettled(ASSETS_TO_CACHE.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// 3. ÉVÉNEMENT 'ACTIVATE' : Nettoyage des anciens caches de l'interface
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 4. ÉVÉNEMENT 'FETCH' : Interception des requêtes réseau et distribution hors ligne
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Ignorer les requêtes vers Google Apps Script (sauvegarde des stats)
  if (requestUrl.includes('://://google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        console.warn(`[Service Worker] Ressource introuvable hors ligne : ${requestUrl}`);
      });
    })
  );
});
