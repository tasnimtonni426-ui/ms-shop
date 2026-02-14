const CACHE_NAME = 'ms-store-v5';

// ইন্সটল করার সময় কোনো ফিক্সড পেজ ক্যাশ করার দরকার নেই
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// এই অংশটিই আপনার সব পেজ ওপেন হতে সাহায্য করবে
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    }
});
