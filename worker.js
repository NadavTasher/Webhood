self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).then(function (fetchResponse) {
            return fetchResponse;
        }).catch(function () {
            return new Response("Offline");
        })
    );
});