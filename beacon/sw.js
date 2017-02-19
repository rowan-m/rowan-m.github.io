var cacheName = 'beacon-v20170219';

// Cache a very basic selection of resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/beacon/',
        '/beacon/index.html',
        '/beacon/img/grass-montillona-720x1116.jpg',
        '/beacon/img/twitter-80x80.png',
        '/beacon/img/grass-montillona-992x412.jpg',
        '/beacon/img/favicon-16x16.png',
        '/beacon/img/favicon-96x96.png',
        'https://cdn.ampproject.org/v0.js',
        'https://cdn.ampproject.org/v0/amp-analytics-0.1.js',
        'https://cdn.ampproject.org/v0/amp-instagram-0.1.js',
        'https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js',
        'https://cdn.ampproject.org/v0/amp-social-share-0.1.js',
        'https://fonts.googleapis.com/css?family=Roboto+Condensed|Rock+Salt'
      ]);
    })
  );
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
