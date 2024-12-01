const SYNC_TAG = 'chat-sync';
const DB_NAME = 'chat-cache';
const DB_VERSION = 1;
const CACHE_NAME = 'chat-cache-v1';

const SYNC_SUPPORTED = 'sync' in self.registration;

console.log('Service Worker: Background sync supported?', 'sync' in self.registration);
console.log('Periodic sync supported?', 'periodicSync' in self.registration);

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

async function storeOfflineRequest(request) {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-requests')) {
        db.createObjectStore('offline-requests', { keyPath: 'timestamp' });
      }
    };
  });

  const tx = db.transaction('offline-requests', 'readwrite');
  const store = tx.objectStore('offline-requests');
  await store.add({
    request: request,
    timestamp: Date.now(),
    status: 'pending'
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/chat')) {
    event.respondWith(
      fetch(event.request.clone()).catch(async () => {
        const request = event.request.clone();
        const requestDetails = {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          body: await request.clone().json()
        };

        await storeOfflineRequest(requestDetails);

        console.log('Storing offline request:', requestDetails);

        if (SYNC_SUPPORTED) {
          try {
            await self.registration.sync.register(SYNC_TAG);
            console.log('Sync registered successfully');
          } catch (error) {
            console.error('Failed to register sync:', error);
          }
        } else {
          console.log('Background sync not supported');
        }

        return new Response(
          JSON.stringify({
            offline: true,
            message: 'Currently offline. Message will be sent when online.',
            queuedRequest: requestDetails
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  }
});

self.addEventListener('message', async (event) => {
  if (event.data === 'trigger-sync') {
    console.log('Manual sync triggered, sync supported?', 'sync' in self.registration);
    if ('sync' in self.registration) {
      try {
        // Try to get pending syncs
        const tags = await self.registration.sync.getTags();
        console.log('Pending sync tags:', tags);

        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open(DB_NAME, DB_VERSION);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
        });

        // Check if we have pending requests
        const tx = db.transaction('offline-requests', 'readonly');
        const store = tx.objectStore('offline-requests');
        const requests = await new Promise((resolve) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
        });

        console.log('Found pending requests:', requests);

        if (requests.length > 0) {
          console.log('Processing requests immediately');
          for (const request of requests) {
            try {
              const response = await fetch(request.request.url, {
                method: request.request.method,
                headers: request.request.headers,
                body: JSON.stringify(request.request.body)
              });

              // Get response text
              const text = await response.text();

              // Process the streamed response
              const lines = text.split('\n').filter(line => line.trim());
              let content = '';

              for (const line of lines) {
                if (line.startsWith('0:')) {
                  content += line.slice(2).replace(/^"|"$/g, '');
                }
              }

              // Add new message to messages store
              const messagesTx = db.transaction('messages', 'readwrite');
              const messagesStore = messagesTx.objectStore('messages');

              const newMessage = {
                id: crypto.randomUUID(),
                content: content,
                role: 'assistant',
                timestamp: Date.now()
              };

              await new Promise((resolve, reject) => {
                const addRequest = messagesStore.add(newMessage);
                addRequest.onerror = () => reject(addRequest.error);
                addRequest.onsuccess = () => resolve(undefined);
              });

              console.log('Added new message:', newMessage);

              // Delete the processed request
              const deleteTx = db.transaction('offline-requests', 'readwrite');
              const deleteStore = deleteTx.objectStore('offline-requests');
              await new Promise((resolve, reject) => {
                const deleteRequest = deleteStore.delete(request.timestamp);
                deleteRequest.onerror = () => reject(deleteRequest.error);
                deleteRequest.onsuccess = () => resolve(undefined);
              });

              const clients = await self.clients.matchAll();
              clients.forEach(client => client.navigate(client.url));

            } catch (error) {
              console.error('Immediate sync failed:', error);
            }
          }
        }
      } catch (error) {
        console.error('Sync registration/processing failed:', error);
      }
    } else {
      console.warn('Background sync not supported');
    }
  }
});
