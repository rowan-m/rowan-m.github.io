self.addEventListener('fetch', event => {
    suffixIndex = event.request.url.indexOf('.amp.html');
    isEmbed = event.request.url.endsWith('?embed=1');

    if (!isEmbed && suffixIndex !== -1) {
        event.respondWith(
            fetch('/iframe-shell/')
        );
    }
});
