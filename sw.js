importScripts("/global/sites/pwaHub/versioncontrol.js");

const CACHE_NAME = `ethans-games-${PWA_VERSION}`;

const APP_SHELL = [
  "/index.html",
  "/global/sites/pwaHub/pwahub.html",
  "/global/sites/pwaHub/js/pwaswinteractor.js",
  "/global/sites/pwaHub/js/pwathemes.js",
  "/global/sites/pwaHub/css/styles.css"
];

self.addEventListener("install", event => {
  event.respondWith((async () => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  try {
    const response = await fetch(req);

    if (response.ok && response.type === "basic") {
      await cache.put(req, response.clone());
    }

    return cached || response;
  } catch {
    return cached || Response.error();
  }
})());
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

  event.respondWith(handleFetch(req, url));
});

async function handleFetch(req, url) {
  const cache = await caches.open(CACHE_NAME);

  if (
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith("/sw.js") ||
    url.pathname.endsWith("/versioncontrol.js")
  ) {
    return fetch(req);
  }

  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    try {
      const response = await fetch(req, { redirect: "follow" });

      if (response.ok && response.type === "basic") {
        await cache.put(req, response.clone());
      }

      return response;
    } catch {
      return await cache.match(req, { ignoreSearch: true }) ||
             await cache.match("/sites/pwaHub/pwahub.html") ||
             Response.error();
    }
  }

  const cached = await cache.match(req);

  try {
    const response = await fetch(req);

    if (response.ok && response.type === "basic") {
      await cache.put(req, response.clone());
    }

    return cached || response;
  } catch {
    return cached || Response.error();
  }
}

self.addEventListener("message", event => {
  if (event.data === "UPDATE_NOW") {
    event.source?.postMessage("UPDATE_INSTALLED");
    self.skipWaiting();
  }
});