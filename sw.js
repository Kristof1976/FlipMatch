const CACHE_NAME = 'flipmatch-v5'; //bij elke update versienummer verhogen voor update te triggeren
const BASE_PATH = '/FlipMatch/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/main.css',
  BASE_PATH + 'js/main.js',
  BASE_PATH + 'js/ui.js',
  BASE_PATH + 'js/game.js',
  BASE_PATH + 'js/gameManager.js',
  BASE_PATH + 'js/board.js',
  BASE_PATH + 'js/card.js',
  BASE_PATH + 'js/config.js',
  BASE_PATH + 'js/effects.js',
  BASE_PATH + 'js/achievements.js',
  BASE_PATH + 'manifest.json',
  // Emojis
  BASE_PATH + 'img/emojis/0.png',
  BASE_PATH + 'img/emojis/1.png',
  BASE_PATH + 'img/emojis/2.png',
  BASE_PATH + 'img/emojis/3.png',
  BASE_PATH + 'img/emojis/4.png',
  BASE_PATH + 'img/emojis/5.png',
  BASE_PATH + 'img/emojis/6.png',
  BASE_PATH + 'img/emojis/7.png',
  BASE_PATH + 'img/emojis/8.png',
  BASE_PATH + 'img/emojis/9.png',
  BASE_PATH + 'img/emojis/10.png',
  BASE_PATH + 'img/emojis/11.png',
  BASE_PATH + 'img/emojis/12.png',
  BASE_PATH + 'img/emojis/13.png',
  BASE_PATH + 'img/emojis/14.png',
  BASE_PATH + 'img/emojis/15.png',
  BASE_PATH + 'img/emojis/16.png',
  BASE_PATH + 'img/emojis/17.png',
  BASE_PATH + 'img/emojis/18.png',
  BASE_PATH + 'img/emojis/19.png',
  BASE_PATH + 'img/emojis/20.png',
  BASE_PATH + 'img/emojis/21.png',
  BASE_PATH + 'img/emojis/22.png',
  BASE_PATH + 'img/emojis/23.png',
  BASE_PATH + 'img/emojis/24.png',
  BASE_PATH + 'img/emojis/25.png',
  BASE_PATH + 'img/emojis/26.png',
  BASE_PATH + 'img/emojis/27.png',
  BASE_PATH + 'img/emojis/28.png',
  BASE_PATH + 'img/emojis/29.png',
  BASE_PATH + 'img/emojis/30.png',
  BASE_PATH + 'img/emojis/31.png',
  BASE_PATH + 'img/emojis/q.png',
  BASE_PATH + 'img/emojis/tu.png',
  // Animals
  BASE_PATH + 'img/animals/Ant.png',
  BASE_PATH + 'img/animals/Badger.png',
  BASE_PATH + 'img/animals/Bat.png',
  BASE_PATH + 'img/animals/Bear.png',
  BASE_PATH + 'img/animals/Bison.png',
  BASE_PATH + 'img/animals/Butterfly.png',
  BASE_PATH + 'img/animals/Camel.png',
  BASE_PATH + 'img/animals/Cat.png',
  BASE_PATH + 'img/animals/Caterpillar.png',
  BASE_PATH + 'img/animals/Cow.png',
  BASE_PATH + 'img/animals/Crab.png',
  BASE_PATH + 'img/animals/Dog.png',
  BASE_PATH + 'img/animals/Dolphin.png',
  BASE_PATH + 'img/animals/Elephant.png',
  BASE_PATH + 'img/animals/Flamingo.png',
  BASE_PATH + 'img/animals/Fly.png',
  BASE_PATH + 'img/animals/Fox.png',
  BASE_PATH + 'img/animals/Goat.png',
  BASE_PATH + 'img/animals/Gorilla.png',
  BASE_PATH + 'img/animals/Horse.png',
  BASE_PATH + 'img/animals/Jellyfish.png',
  BASE_PATH + 'img/animals/Kangeroo.png',
  BASE_PATH + 'img/animals/Lobster.png',
  BASE_PATH + 'img/animals/Monkey.png',
  BASE_PATH + 'img/animals/Monkey_face.png',
  BASE_PATH + 'img/animals/Panda.png',
  BASE_PATH + 'img/animals/Peacock.png',
  BASE_PATH + 'img/animals/Penguin.png',
  BASE_PATH + 'img/animals/Pig.png',
  BASE_PATH + 'img/animals/Pows.png',
  BASE_PATH + 'img/animals/Rabbit.png',
  BASE_PATH + 'img/animals/Ram.png',
  BASE_PATH + 'img/animals/Rat.png',
  BASE_PATH + 'img/animals/Rhino.png',
  BASE_PATH + 'img/animals/Rooster.png',
  BASE_PATH + 'img/animals/Seal.png',
  BASE_PATH + 'img/animals/Shark.png',
  BASE_PATH + 'img/animals/Snale.png',
  BASE_PATH + 'img/animals/Spider.png',
  BASE_PATH + 'img/animals/Squirel.png',
  BASE_PATH + 'img/animals/Tiger.png',
  BASE_PATH + 'img/animals/Tropical_fish.png',
  BASE_PATH + 'img/animals/Turtle.png',
  BASE_PATH + 'img/animals/Water Buffalo.png',
  BASE_PATH + 'img/animals/Whale.png',
  BASE_PATH + 'img/animals/Wolf.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response for cache 
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match(BASE_PATH + 'index.html');
        }
      })
  );
});

// Background sync for game progress
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-progress') {
    console.log('Service Worker: Background sync - saving progress');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  return Promise.resolve();
}

// Push notifications (optional for game updates)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New content available!',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Play Now',
          icon: './icons/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: './icons/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Memory Game', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(BASE_PATH)
    );
  }
});