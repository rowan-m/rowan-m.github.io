var cacheName = 'fragile-shell-v20160806';
var filesToCache = [
    '/iframe-shell/',
    '/iframe-shell/index.html',
    '/iframe-shell/placeholder.html',
    '/iframe-shell/amp/01.amp.html?embed=1',
    '/iframe-shell/amp/02.amp.html?embed=1',
    '/iframe-shell/amp/03.amp.html?embed=1',
    '/iframe-shell/amp/04.amp.html?embed=1'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('[ServiceWorker] Fetch request', event.request.url);
    suffixIndex = event.request.url.indexOf('.amp.html');
    isEmbed = event.request.url.endsWith('?embed=1');

    if (!isEmbed && suffixIndex !== -1) {
        console.log('[ServiceWorker] Load iframe-shell ', event.request.url);
        event.respondWith(
            caches.match(new Request('/iframe-shell/index.html')).then(function(response) {
                return response || fetch('/iframe-shell/index.html');
            })
        );
    } else {
        console.log('[ServiceWorker] Check cache ', event.request.url);
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});
