const CACHE_NAME = 'qcm-app-shell-v1.13'; // Incrémentez ici à chaque mise à jour

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

// Fichiers devant impérativement être vérifiés sur le réseau en priorité (Évite le blocage iOS)
const DYNAMIC_ASSETS = ['index.html', 'manifest.json', '/'];

// --- AJOUT INDISPENSABLE POUR IOS 18 ---
// Écoute le message envoyé par main.js pour forcer l'activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Utilisation de allSettled pour éviter qu'un seul asset manquant ne bloque toute l'installation
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
  const urlObject = new URL(requestUrl);

  // Filtrer les URL invalides ou externes spécifiques
  if (requestUrl.includes('://://google.com')) return;

  // 🚀 STRATÉGIE NETWORK-FIRST pour l'index et le manifest : résout le blocage de mise à jour sur iOS
  // Correction de la détection : gère "/" et les fichiers critiques plus proprement
  const isCriticalAsset = DYNAMIC_ASSETS.some(asset => 
    urlObject.pathname.endsWith(asset) || urlObject.pathname === asset || (asset === '/' && urlObject.pathname.endsWith('/'))
  );

  if (isCriticalAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // On met à jour le cache dynamiquement avec la nouvelle version réseau
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)) // Mode hors-ligne en dernier recours
    );
    return;
  }

  // STRATÉGIE CACHE-FIRST pour le reste des composants (styles, scripts, images)
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
