const CACHE_NAME = 'ms-store-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// সার্ভিস ওয়ার্কার ইন্সটল করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// নেটওয়ার্ক রিকোয়েস্ট হ্যান্ডেল করা
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
      
