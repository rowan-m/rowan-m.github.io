var cacheName = 'fragile-shell-v20160806';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                '/iframe-shell/',
                '/iframe-shell/index.html',
                '/iframe-shell/placeholder.html',
                '/iframe-shell/amp/01.amp.html?embed=1',
                '/iframe-shell/amp/02.amp.html?embed=1',
                '/iframe-shell/amp/03.amp.html?embed=1',
                '/iframe-shell/amp/04.amp.html?embed=1',
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
            caches.open(cacheName).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    var fetchPromise = fetch(event.request).then(function(networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    })
                    return response || fetchPromise;
                })
            })
        );
    }
});
