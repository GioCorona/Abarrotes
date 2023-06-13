const CacheStatic = "cacheEstatico-1";
const CacheDynamic = "cacheDinamico-1";

addEventListener("install", (event) => {
	const cache = caches.open(CacheStatic).then((cache) => {
		cache.addAll([
			"https://code.jquery.com/jquery-3.6.0.js",
			"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
			"https://kit.fontawesome.com/c3214449a0.js",
		]);
	});
	event.waitUntil(cache);
	self.skipWaiting();
});

addEventListener("fetch", (event) => {
	const respuesta = caches.match(event.request).then((res) => {
		if (res) {
			return res;
		}

		return fetch(event.request).then((newRes) => {
			return newRes;
		});
	});
	event.respondWith(respuesta);
});
