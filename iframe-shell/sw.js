self.addEventListener('fetch', event => {
    suffixIndex = event.request.url.indexOf('.amp.html');
    isEmbed = event.request.url.endsWith('?embed=1');

    if (!isEmbed && suffixIndex !== -1) {
        ampPage = event.request.url.substring(suffixIndex - 2, suffixIndex);
        console.log(ampPage);
        event.respondWith(
            fetch('/#' + ampPage)
        );
    }

});
