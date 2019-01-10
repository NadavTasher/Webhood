self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (cacheResponse) {
            return cacheResponse || fetch(event.request).then(function (fetchResponse) {
                let responseClone = fetchResponse.clone();
                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return fetchResponse;
            });
        }).catch(function () {
            return new Response("Offline");
        })
    );
});