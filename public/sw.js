const SYNC_TAG = 'chat-sync';
const DB_NAME = 'chat-cache';
const DB_VERSION = 1;
const CACHE_NAME = 'chat-cache-v1';

const SYNC_SUPPORTED = 'sync' in self.registration;

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

        if (SYNC_SUPPORTED) {
          await self.registration.sync.register(SYNC_TAG);
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

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(
      (async () => {
        try {
          const db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
          });

          const requests = await new Promise((resolve, reject) => {
            const tx = db.transaction('offline-requests', 'readonly');
            const store = tx.objectStore('offline-requests');
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
          });
          console.log("Dank requests", requests)

          if (requests && requests.length > 0) {
            for (const request of requests) {
              try {
                console.log("processing response")
                let response = await fetch(request.request.url, {
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
                    // Extract content from chunks
                    content += line.slice(2).replace(/^"|"$/g, '');
                  }
                  // Ignore the metadata lines (e: and d:)
                }

                // Get existing messages
                const messagesTx = db.transaction('messages', 'readwrite');
                const messagesStore = messagesTx.objectStore('messages');
                const existingMessages = await new Promise((resolve, reject) => {
                  const request = messagesStore.getAll();
                  request.onerror = () => reject(request.error);
                  request.onsuccess = () => resolve(request.result);
                });

                console.log('Existing messages:', existingMessages);

                // Add new message with timestamp
                const newMessage = {
                  id: crypto.randomUUID(),
                  content: content,  // Use processed content
                  role: 'assistant',
                  timestamp: Date.now()
                };

                await new Promise((resolve, reject) => {
                  const addRequest = messagesStore.add(newMessage);
                  addRequest.onerror = () => reject(addRequest.error);
                  addRequest.onsuccess = () => resolve(undefined);
                });

                console.log('Added new message:', newMessage);

                const deleteTx = db.transaction('offline-requests', 'readwrite');
                const store = deleteTx.objectStore('offline-requests');
                await new Promise((resolve, reject) => {
                  const deleteRequest = store.delete(request.timestamp);
                  deleteRequest.onerror = () => reject(deleteRequest.error);
                  deleteRequest.onsuccess = () => resolve(undefined);
                });

                // const clients = await self.clients.matchAll();
                // clients.forEach(client => client.navigate(client.url));
              } catch (error) {
                console.error('Error processing sync:', error);
                // Keep request in store if sync fails
              }
            }
          }
        } catch (error) {
          console.log("Dank something went wrong", error)
          // Will retry on next sync
        }
      })()
    );
  }
});
