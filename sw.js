const CacheStoreName = "dev_v2";

const STATIC_ASSETS = [
  "/sites/pwaHub/pwahub.html",
  "/sites/pwaHub/js/pwaswinteractor.js",
  "/sites/pwaHub/js/pwathemes.js",
  "/sites/pwaHub/css/styles.css",
  "/manifest.webmanifest",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CacheStoreName).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CacheStoreName) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/sites/pwaHub/pwahub.html"))
    );
    return;
  }
  
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(response => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        event.waitUntil(
          caches.open(CacheStoreName).then(cache => cache.put(req, clone))
        );

        return response;
      });
    })
  );
});