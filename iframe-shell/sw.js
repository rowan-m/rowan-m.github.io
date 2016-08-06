var cacheName = 'fragile-shell-v20160806';
var filesToCache = [
    '/iframe-shell/',
    '/iframe-shell/index.html',
    '/iframe-shell/placeholder.html',
    '/iframe-shell/amp/01.amp.html',
    '/iframe-shell/amp/02.amp.html',
    '/iframe-shell/amp/03.amp.html',
    '/iframe-shell/amp/04.amp.html',
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    suffixIndex = event.request.url.indexOf('.amp.html');
    isEmbed = event.request.url.endsWith('?embed=1');

    if (!isEmbed && suffixIndex !== -1) {
        event.respondWith(
            fetch('/iframe-shell/')
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});
