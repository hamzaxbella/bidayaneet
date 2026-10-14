/* Cache only the public field shell and immutable assets; never API or authenticated pages. */
const CACHE = "bidaya-terrain-v1";
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const response = await fetch("/terrain", { cache: "reload" });
      if (!response.ok) throw new Error("Terrain unavailable");
      const html = await response.clone().text();
      const assets = [
        ...new Set(
          [...html.matchAll(/(?:src|href)="([^" ]+)"/g)]
            .map((m) => m[1])
            .filter((p) => p.startsWith("/_next/static/")),
        ),
      ];
      await cache.put("/terrain", response);
      await cache.addAll([...assets, "/logo.png", "/manifest.webmanifest"]);
      await self.skipWaiting();
    })(),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("bidaya-terrain-") && key !== CACHE)
          await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin)
    return;
  if (event.request.mode === "navigate" && url.pathname === "/terrain") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(event.request);
        } catch {
          return (await caches.match("/terrain")) || Response.error();
        }
      })(),
    );
  } else if (
    url.pathname.startsWith("/_next/static/") ||
    ["/logo.png", "/manifest.webmanifest"].includes(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok)
          await (await caches.open(CACHE)).put(event.request, response.clone());
        return response;
      })(),
    );
  }
});
self.addEventListener("message", (event) => {
  if (event.data?.type !== "PREPARE") return;
  event.waitUntil(
    (async () => {
      try {
        const assets = event.data.urls.filter((value) => {
          const url = new URL(value, self.location.origin);
          return (
            url.origin === self.location.origin &&
            url.pathname.startsWith("/_next/static/")
          );
        });
        await (await caches.open(CACHE)).addAll(assets);
        event.ports[0]?.postMessage({ ok: true });
      } catch {
        event.ports[0]?.postMessage({ ok: false });
      }
    })(),
  );
});
