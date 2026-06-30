importScripts("/global/sites/pwaHub/versioncontrol.js");

const CACHE_NAME = `ethans-games-${PWA_VERSION}`;
const FALLBACK_PAGE = "/global/sites/pwaHub/pwahub.html";

const APP_SHELL = [
  "/index.html",
  "/global/sites/pwaHub/pwahub.html",
  "/global/sites/pwaHub/js/pwaswinteractor.js",
  "/global/sites/pwaHub/js/pwathemes.js",
  "/global/sites/pwaHub/css/styles.css"
];

self.addEventListener("install", event => {
  event.waitUntil(precache());
});

async function precache() {
  const cache = await caches.open(CACHE_NAME);

  for (const asset of APP_SHELL) {
    try {
      const response = await fetch(asset, { redirect: "follow" });

      if (response.ok && response.type === "basic") {
        await cache.put(asset, response.clone());
      }
    } catch {}
  }
}

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  event.respondWith(handleFetch(req, url));
});

async function handleFetch(req, url) {
  if (
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith("/sw.js") ||
    url.pathname.endsWith("/versioncontrol.js")
  ) {
    return fetch(req);
  }

  if (url.pathname.endsWith(".mp4")) {
    return handleVideoRequest(req);
  }

  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    return networkFirst(req);
  }

  return cacheFirstUpdate(req);
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(req, { redirect: "follow" });

    if (response.ok && response.type === "basic") {
      await cache.put(req, response.clone());
    }

    return response;
  } catch {
    return await cache.match(req, { ignoreSearch: true }) ||
           await cache.match(FALLBACK_PAGE) ||
           Response.error();
  }
}

async function cacheFirstUpdate(req) {
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
}

async function handleVideoRequest(req) {
  const cache = await caches.open(CACHE_NAME);

  let cached = await cache.match(req.url);

  if (!cached) {
    const response = await fetch(req);

    if (response.ok && response.type === "basic") {
      await cache.put(req.url, response.clone());
    }

    cached = response;
  }

  const range = req.headers.get("range");

  if (!range) return cached;

  const blob = await cached.blob();
  const size = blob.size;

  const [startText, endText] = range.replace("bytes=", "").split("-");
  const start = Number(startText);
  const end = endText ? Number(endText) : size - 1;

  const sliced = blob.slice(start, end + 1);

  return new Response(sliced, {
    status: 206,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(sliced.size),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes"
    }
  });
}

self.addEventListener("message", event => {
  if (event.data === "UPDATE_NOW") {
    event.source?.postMessage("UPDATE_INSTALLED");
    self.skipWaiting();
  }
});