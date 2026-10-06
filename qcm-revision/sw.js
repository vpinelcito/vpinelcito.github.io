const CACHE_NAME = 'qcm-app-shell-v0.8'; // Important à chaque màj changer d'une version

//fichiers téléchargé
const ASSETS_TO_CACHE = [
  '/qcm-revision/',
  '/qcm-revision/index.html',
  '/qcm-revision/qcm.html',
  '/qcm-revision/main.js',
  '/qcm-revision/qcm.js',
  '/qcm-revision/dexie.js',
  '/qcm-revision/style.css',
  '/qcm-revision/manifest.json',
  '/qcm-revision/icon-192.png',
  '/qcm-revision/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
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
          // Suppression complète de tous les anciens conteneurs pour éviter de saturer la mémoire du téléphone
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Nettoyage de l\'ancien cache d\'interface :', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Prend le contrôle immédiat de la page en cours sans rechargement nécessaire
      return self.clients.claim();
    })
  );
});

// 4. ÉVÉNEMENT 'FETCH' : Interception des requêtes réseau et distribution hors ligne
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  if (requestUrl.includes('://script.google.com')) {
    return;
  }

  // RÈGLE B : Stratégie standard pour l'App Shell (HTML, CSS, JS) -> Cache-First, repli réseau
  // Comme les images sont en Base64 à l'intérieur du JSON, elles passent par Dexie et non par ici
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si le fichier n'est pas dans l'App Shell, on tente de le chercher sur internet
      return fetch(event.request).catch(() => {
        console.warn(`[Service Worker] Ressource introuvable hors ligne : ${requestUrl}`);
      });
    })
  );
});
