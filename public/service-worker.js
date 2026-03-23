// Service Worker for Bishop Estates Cabana Club PWA
// Provides offline capability, caching, and background sync

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `bishop-cabana-static-${CACHE_VERSION}`,
  dynamic: `bishop-cabana-dynamic-${CACHE_VERSION}`,
  images: `bishop-cabana-images-${CACHE_VERSION}`,
};

// Files to cache on install (essential for offline)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Error caching some assets:', err);
        // Don't fail install if some assets can't be cached
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match current versions
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch event: serve from cache, fallback to network, cache responses
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external APIs
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and non-http requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Different strategies for different asset types
  if (request.destination === 'image') {
    event.respondWith(cacheImageStrategy(request));
  } else if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf)$/)
  ) {
    // Cache-first for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Network-first for HTML and API calls
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache-first strategy: try cache first, then network
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAMES.static);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Fetch failed for:', request.url, err);
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Network-first strategy: try network, fall back to cache
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAMES.dynamic);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.warn('[SW] Network fetch failed for:', request.url, err);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return new Response(
        '<!DOCTYPE html><html><body><h1>Offline</h1><p>Please check your connection and try again.</p></body></html>',
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );
    }
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Image caching strategy: cache images, limit cache size
async function cacheImageStrategy(request) {
  const cache = await caches.open(CACHE_NAMES.images);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      // Optional: limit image cache size
      cleanImageCache();
    }
    return response;
  } catch (err) {
    console.warn('[SW] Failed to fetch image:', request.url);
    // Return placeholder or cached fallback
    const placeholder = await cache.match('/icons/icon-192x192.png');
    return placeholder || new Response('No image', { status: 404 });
  }
}

// Clean up old images from cache (keep last 50)
async function cleanImageCache() {
  const cache = await caches.open(CACHE_NAMES.images);
  const keys = await cache.keys();
  if (keys.length > 50) {
    const toDelete = keys.slice(0, keys.length - 50);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

// Background sync: retry failed requests when online
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPendingRequests());
  }
});

async function syncPendingRequests() {
  // Placeholder for syncing pending requests
  console.log('[SW] Syncing pending requests...');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  if (!event.data) {
    return;
  }

  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'bishop-cabana-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('Bishop Estates Cabana Club', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if open
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === '/' && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      // Open new window if not open
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
