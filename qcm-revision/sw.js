// 1. CONFIGURATION DU CACHE GLOBAL DE L'INTERFACE (L'App Shell)
const CACHE_NAME = 'qcm-app-shell-v0.6'; // Important à chaque màj changer d'une version

// Liste des fichiers statiques locaux indispensables au fonctionnement de l'application
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './qcm.html',
  './main.js',
  './qcm.js',
  './dexie.js',
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 2. ÉVÉNEMENT 'INSTALL' : Téléchargement et stockage de l'App Shell
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