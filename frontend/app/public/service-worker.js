self.addEventListener('fetch', function (event) {
    if (event.request.url.startsWith('http://localhost:8082/media/static/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open('my-cache').then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        console.log(cache)
                        return fetchResponse;
                    });
                });
            })
        );
    }
    // Пропустить другие запросы без кеширования
});


//self.addEventListener('fetch', (event) => {
//    console.log("Работет")
//    event.respondWith(
//        caches.open('my-cache').then((cache) => {
//            return cache.match(event.request).then((response) => {
//                return response || fetch(event.request).then((fetchResponse) => {
//                    // Кешировать и вернуть ответ от сервера
//                    cache.put(event.request, fetchResponse.clone());
//                    return fetchResponse;
//                });
//            });
//        })
//    );
//});

//self.addEventListener('fetch', (event) => {
//    // Проверяем, является ли запрос POST-запросом
//    if (event.request.method === 'POST') {
//        console.log("Я работаю (POST запрос)");
//    }

//    event.respondWith(
//        caches.open('my-cache').then((cache) => {
//            return cache.match(event.request).then((response) => {
//                return response || fetch(event.request).then((fetchResponse) => {
//                    // Кешировать и вернуть ответ от сервера
//                    cache.put(event.request, fetchResponse.clone());
//                    return fetchResponse;
//                });
//            });
//        })
//    );
//});

self.addEventListener('install', (event) => {
    console.log('Установлен');
});

self.addEventListener('activate', (event) => {
    console.log('Активирован');
});

//self.addEventListener('fetch', (event) => {
//    console.log('Происходит запрос на сервер');
//    console.log("Работает");
//    event.respondWith(
//        caches.open('my-cache').then((cache) => {
//            return cache.match(event.request).then((response) => {
//                return response || fetch(event.request).then((fetchResponse) => {
//                    // Кешировать и вернуть ответ от сервера
//                    cache.put(event.request, fetchResponse.clone());
//                    return fetchResponse;
//                });
//            });
//        })
//    );
//});