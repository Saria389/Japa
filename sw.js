/* sw.js — يعمل الموقع بدون إنترنت، ويجلب التحديثات تلقائياً.
   عند تعديل أي ملف ارفع رقم الإصدار هنا ليتحدّث عند المستخدمين. */
const CACHE_NAME = 'sari-app-v4';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './theme.css',
  './ui.css',
  './dict-data.js',
  './audio.js',
  './content-ja.js',
  './phrases.js',
  './ui.js',
  './langs-addon.js',
  './multilang.js',
  './spot-mistake.js',
  './pronunciation.js',
  './extras.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', (e) => {
  // كل ملف على حدة: ملف مفقود واحد لا يُفشل التثبيت كله
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(FILES_TO_CACHE.map((f) => cache.add(f).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // الخطوط من Google: من الكاش أولاً ثم الشبكة
  if (url.origin !== location.origin) {
    if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
      e.respondWith(caches.open(CACHE_NAME).then((c) => c.match(req).then((hit) => hit ||
        fetch(req).then((res) => { c.put(req, res.clone()); return res; }))));
    }
    return;
  }

  // ملفات الموقع: الشبكة أولاً (لتصل التحديثات)، والكاش عند انقطاع الإنترنت
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
