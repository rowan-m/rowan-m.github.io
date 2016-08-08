var cacheName = 'fragile-shell-v20160806';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/iframe-shell/',
        '/iframe-shell/index.html',
        '/iframe-shell/offline.html',
        '/iframe-shell/amp/01.amp.html?embed=1',
        '/iframe-shell/amp/02.amp.html?embed=1',
        '/iframe-shell/img/shell.jpg',
        '/iframe-shell/img/shell02.jpg',
        '/iframe-shell/img/icons/favicon-16x16.png',
        '/iframe-shell/img/icons/favicon-96x96.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  suffixIndex = event.request.url.indexOf('.amp.html');
  isEmbed = event.request.url.endsWith('?embed=1');

  if (!isEmbed && suffixIndex !== -1) {
    event.respondWith(
      caches.match(new Request('/iframe-shell/index.html')).then(function(response) {
        return response || fetch('/iframe-shell/index.html');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      }).catch(function() {
        return caches.match('/iframe-shell/offline.html');
      })
    );
  }
});
