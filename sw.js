const CACHE_NAME = 'tipout-v4';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
          caches.keys().then(keys =>
                  Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
                                 )
        );
    self.clients.claim();
});

// Network first, cache only as the offline fallback.
//
// ⚠️ THAT WAS NOT ENOUGH ON ITS OWN. GitHub Pages serves the page with
// `cache-control: max-age=600`, and a plain fetch() still answers from the
// browser's own HTTP cache — so for ten minutes after a deploy the app could
// reload and get the PREVIOUS build, with nothing on screen saying so. It cost
// Vinny a "this one isn't calculating" when the row calculated fine in the build
// he did not have yet, and the hosts using this nightly will never think to
// hard-reload.
//
// So the PAGE itself is always fetched past that cache. Sub-resources are left
// alone: they are versioned by the page that asks for them, and bypassing the
// cache for everything would make every launch slower for no benefit.
//
// Guarded: if a browser refuses the `cache` option, we fall back to the ordinary
// request rather than throwing inside the fetch handler — an exception here takes
// the whole app down, offline and online alike.
self.addEventListener('fetch', e => {
    let req = e.request;
    if (e.request.mode === 'navigate') {
        try { req = new Request(e.request, { cache: 'reload' }); } catch (_) { req = e.request; }
    }
    e.respondWith(
          fetch(req).then(resp => {
                  // Network succeeded - cache the fresh response and return it
                                      const clone = resp.clone();
                  caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                  return resp;
          }).catch(() => {
                  // Network failed - fall back to cache (offline support)
                         return caches.match(e.request);
          })
        );
});
