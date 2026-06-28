const CacheStoreName = "dev_v1";
//obsolete
const addResources = async (resources) => {
    const cache = await caches.open(CacheStoreName);
    await cache.addAll(resources);
};
const addResource = async (request, response) => {
    const cache = await caches.open(CacheStoreName);
    await cache.put(request, response);
};

const cachefirst = async (request, event) => {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) return cacheResponse;
    const netresponse = await fetch(request);
    event.waitUntil(addResource(request, netresponse.clone()));
};

self.addEventListener("install",(event) => {
    event.waitUntil(
        addResources([
            "/",
            "/sites/pwaHub/pwaHub.html",
            "/sites/pwaHub/css/styles.css",
            "/sites/pwaHub/js/pwaswinteractor.js",
            "/sites/pwaHub/js/pwathemes.js",
            "/games",
            "/games/ethansgames",
            "/games/SiegeProtectors",
            
        ]),
    )
});

self.addEventListener("fetch", (event)=>{
    event.respondWith(cachefirst(event.request,event));
});
