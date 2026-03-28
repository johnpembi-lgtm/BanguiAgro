const cacheName = 'agro-v1';
const assets = ['./', './index.html'];

// Mise en cache des fichiers essentiels
self.addEventListener('install', e => {
    e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

// Intercepter les requêtes pour servir le cache si on est hors-ligne
self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
