var cacheName = 'fragile-shell-v20160806';
var filesToCache = [
    '/iframe-shell/',
    '/iframe-shell/index.html',
    '/iframe-shell/placeholder.html',
    '/iframe-shell/amp/01.amp.html',
    '/iframe-shell/amp/02.amp.html',
    '/iframe-shell/amp/03.amp.html',
    '/iframe-shell/amp/04.amp.html'
];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetch request', event.request.url);
    suffixIndex = event.request.url.indexOf('.amp.html');
    isEmbed = event.request.url.endsWith('?embed=1');

    if (!isEmbed && suffixIndex !== -1) {
        event.respondWith(
            fetch('/iframe-shell/')
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});
