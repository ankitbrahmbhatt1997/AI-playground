import { initDB } from './index';
import { ChatMessage, ChatSession } from '@/types/db';

export async function saveMessage(message: ChatMessage): Promise<void> {
  const db = await initDB();
  await db.put('messages', message);
}

//  This is not used anymore, but we should keep it for now, Added this because put was behaving weirdly
export async function saveIfNotExists(message: ChatMessage): Promise<void> {
  const db = await initDB();
  const messageFromDb = await db.get('messages', message.id);

  if (!messageFromDb) {
    await db.add('messages', message);
  } else {
  }
}

export async function getMessages(): Promise<ChatMessage[]> {
  const db = await initDB();
  console.log('🔍 Fetching all messages');
  const messages = await db.getAllFromIndex('messages', 'by-timestamp');
  console.log('📦 Retrieved messages:', messages.length);
  return messages;
}

export async function saveSession(session: ChatSession): Promise<void> {
  const db = await initDB();
  await db.put('sessions', session);
}

export async function getSession(id: string): Promise<ChatSession | undefined> {
  const db = await initDB();
  return db.get('sessions', id);
}

export async function clearOldSessions(maxAge: number): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('sessions', 'readwrite');
  const index = tx.store.index('by-last-updated');
  const cutoff = Date.now() - maxAge;

  let cursor = await index.openCursor();
  while (cursor) {
    if (cursor.value.lastUpdated < cutoff) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
}

export async function clearAllMessages(): Promise<void> {
  const db = await initDB();
  console.log('🗑️ Starting clear all messages');
  await db.clear('messages');
  console.log('🧹 Completed clear all messages');
}