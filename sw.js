// EJD Solar Site offline cache. Version changes on every build so phones pick up updates.
var C = 'ejd-solar-dfdab68c', FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(C).then(function(c){ return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(x){ return x !== C; }).map(function(x){ return caches.delete(x); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET') return;
  // cache first (works with no signal on the roof), refresh the cache in the background
  e.respondWith(caches.open(C).then(function(c){ return c.match(e.request, {ignoreSearch: true}).then(function(hit){
    var net = fetch(e.request).then(function(r){ if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(function(){ return hit || c.match('index.html'); });
    return hit || net; }); }));
});
