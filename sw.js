const CACHE_NAME = 'tipout-v2';

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

self.addEventListener('fetch', e => {
    e.respondWith(
          fetch(e.request).then(resp => {
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
