/* Service worker: membuat aplikasi bisa dipasang (PWA) dan halaman depan tetap terbuka saat sinyal lemah.
   Hanya file etalase di domain ini yang disimpan. Panggilan ke server (Apps Script) TIDAK pernah disimpan. */
const CACHE = 'absen-etalase-v4';
const FILES = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png', '/apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;   // server & CDN: langsung ke internet
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { const salin = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, salin); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('/'); });
  }));
});
