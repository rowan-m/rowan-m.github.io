var cacheName = 'shadow-shell-v20160811';

// Cache a very basic selection of resources
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/shadow-shell/',
        '/shadow-shell/index.html',
        '/shadow-shell/offline.html',
        '/shadow-shell/splash.html',
        '/shadow-shell/amp/01.amp.html?embed=1',
        '/shadow-shell/amp/02.amp.html?embed=1',
        '/shadow-shell/img/shell.jpg',
        '/shadow-shell/img/shell02.jpg',
        '/shadow-shell/img/icons/android-icon-96x96.png',
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
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var urlComponents = event.request.url.split('?');
  // If the path ends with ".amp.html" it should be one of our AMP pages
  var isAmpPage = urlComponents[0].endsWith('.amp.html');
  // And if it has not been requested as an embed with the GET parameter
  var isNotEmbedded = (urlComponents[1] !== 'embed=1');

  if (isAmpPage && isNotEmbedded) {
    event.respondWith(
      caches.match(new Request('/shadow-shell/index.html')).then(function(response) {
        // Then we need to serve the shell instead
        return response || fetch('/shadow-shell/index.html');
      })
    );
  } else {
    // Otherwise, we have some very simple functionality to check the cache
    // and serve an offline page when not connected.
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      }).catch(function() {
        return caches.match('/shadow-shell/offline.html');
      })
    );
  }
});
