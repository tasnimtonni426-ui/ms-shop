const CACHE_NAME = 'ms-store-final-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // শুধুমাত্র নেভিগেশন রিকোয়েস্ট (পেজ পরিবর্তন) হ্যান্ডেল করবে
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});
