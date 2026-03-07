/**
 * Munira World — Service Worker
 * Strategy: Cache-first for static assets, Network-first for API calls
 */

const CACHE_VERSION = 'munira-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/logo.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/dashboard/',
    '/dashboard/index.html',
    '/dashboard/style.css',
    '/dashboard/app.js',
    '/shared/lp-cover.js'
];

// ── Install ──────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
        }).then(() => self.skipWaiting())
    );
});

// ── Activate — clean old caches ──────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(k => k.startsWith('munira-') && k !== STATIC_CACHE && k !== API_CACHE)
                .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── Fetch — smart routing ────────────────────────────────
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET, external requests, and chrome-extension
    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;

    // API routes: Network-first, fallback to cache
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstAPI(request));
        return;
    }

    // Static assets: Cache-first, fallback to network
    event.respondWith(cacheFirstStatic(request));
});

// Network-first for API (fresh data preferred, cached for offline)
async function networkFirstAPI(request) {
    const url = new URL(request.url);
    // Skip auth-required APIs (don't cache private data without token)
    const PUBLIC_APIS = ['/api/pages/cover', '/api/pages/packages', '/api/health'];
    const isPublic = PUBLIC_APIS.some(p => url.pathname.startsWith(p));

    try {
        const response = await fetch(request);
        if (response.ok && isPublic) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        if (isPublic) {
            const cached = await caches.match(request);
            if (cached) return cached;
        }
        return new Response(JSON.stringify({ success: false, offline: true, message: 'Anda sedang offline' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Cache-first for static assets
async function cacheFirstStatic(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Offline - serve cached root for navigation requests
        if (request.mode === 'navigate') {
            const fallback = await caches.match('/') || await caches.match('/index.html');
            if (fallback) return fallback;
        }
        return new Response('<h1>Offline</h1><p>Periksa koneksi internet Anda.</p>', {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Push notification support (for future use)
self.addEventListener('push', event => {
    if (!event.data) return;
    const data = event.data.json();
    self.registration.showNotification(data.title || 'Munira CRM', {
        body: data.body || 'Ada notifikasi baru',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        data: data.url ? { url: data.url } : undefined
    });
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.notification.data?.url) {
        clients.openWindow(event.notification.data.url);
    }
});
