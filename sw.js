importScripts("/sites/pwaHub/versioncontrol.js");

const CACHE_NAME = `ethans-games-${PWA_VERSION}`;

const APP_SHELL = [
  "/index.html",
  "/sites/pwaHub/pwahub.html",
  "/sites/pwaHub/js/pwaswinteractor.js",
  "/sites/pwaHub/js/pwathemes.js",
  "/sites/pwaHub/css/styles.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of APP_SHELL) {
        const response = await fetch(asset, { redirect: "follow" });

        if (response.ok && response.type === "basic") {
          await cache.put(asset, response);
        }
      }
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Never cache manifest, service worker, or version file.
  if (
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith("/sw.js") ||
    url.pathname.endsWith("/versioncontrol.js")
  ) {
    event.respondWith(fetch(req));
    return;
  }

  // Pages: network first, fallback to PWA hub.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req, { redirect: "follow" }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.match("/sites/pwaHub/pwahub.html", {
          ignoreSearch: true
        });
      })
    );
    return;
  }

  // Static files: cache first, then update cache from network.
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(req);

      const networkFetch = fetch(req).then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          cache.put(req, response.clone());
        }

        return response;
      });

      return cached || networkFetch;
    })
  );
});

self.addEventListener("message", event => {
  if (event.data === "UPDATE_NOW") {
    event.source?.postMessage("UPDATE_INSTALLED");
    event.waitUntil(self.skipWaiting());
  }
});