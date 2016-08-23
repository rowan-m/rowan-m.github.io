var cacheName = 'beacon-v20160817';

// Cache a very basic selection of resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/beacon/',
        '/beacon/index.html',
        '/beacon/img/grass-montillona-1440x2232.jpg',
        '/beacon/img/twitter-80x80.png',
        '/beacon/img/grass-montillona-992x412.jpg',
        '/beacon/img/favicon-16x16.png',
        '/beacon/img/favicon-96x96.png',
      ]);
    })
  )
});

// Clean out old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(existingCacheNames) {
      return Promise.all(
        existingCacheNames.map(function(existingCacheName) {
          if (existingCacheName !== cacheName) {
            return caches.delete(existingCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
