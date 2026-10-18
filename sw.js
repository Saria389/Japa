const CACHE_NAME = 'sari-app-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './theme.css',
  './dict-data.js',
  './langs-addon_2.js',
  './multilang.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});