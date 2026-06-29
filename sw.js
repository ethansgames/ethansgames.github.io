const CacheStoreName = "dev_v2";

const addResource = async (request, response) => {
    const cache = await caches.open(CacheStoreName);
    await cache.put(request, response);
};

const cachefirst = async (request, event) => {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) return cacheResponse;
    const netresponse = await fetch(request);
    event.waitUntil(addResource(request, netresponse.clone()));
    return netresponse;
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CacheStoreName).then(cache => {
            return cache.addAll([
                "/sites/pwaHub/js/pwaswinteractor.js",
                "/sites/pwaHub/js/pwathemes.js",
                "/sites/pwaHub/css/styles.css",
                "/manifest.webmanifest",
            ]);
        })
    );
});

self.addEventListener("fetch", (event)=>{
    event.respondWith(cachefirst(event.request,event));
});

self.addEventListener("message",(event) => {
    if (event.data == "UPDATE_NOW") {
        self.skipWaiting();
        event.waitUntil(self.clients.claim());
        event.source.postMessage("UPDATE_INSTALLED");
    }
});
