var cacheName = 'fragile-shell-v20160806';

// Cache a very basic selection of resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/iframe-shell/',
        '/iframe-shell/index.html',
        '/iframe-shell/offline.html',
        '/iframe-shell/splash.html',
        '/iframe-shell/amp/01.amp.html?embed=1',
        '/iframe-shell/amp/02.amp.html?embed=1',
        '/iframe-shell/img/shell.jpg',
        '/iframe-shell/img/shell02.jpg',
        '/iframe-shell/img/icons/android-icon-96x96.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  suffixIndex = event.request.url.indexOf('.amp.html');
  isEmbed = event.request.url.endsWith('?embed=1');

  // If the requested URL contains "amp.html" and is not an embed,
  // i.e. the AMP page has been requested directly
  if (!isEmbed && suffixIndex !== -1) {
    event.respondWith(
      caches.match(new Request('/iframe-shell/index.html')).then(function(response) {
        // Then we need to serve the shell instead
        return response || fetch('/iframe-shell/index.html');
      })
    );
  } else {
    // Otherwise, we have some very simple functionality to check the cache
    // and serve an offline page when not connected.
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      }).catch(function() {
        return caches.match('/iframe-shell/offline.html');
      })
    );
  }
});
