import { openDB, DBSchema } from 'idb';
import { ChatMessage, ChatSession } from '@/types/db';

export interface Request {
  url: any;
  method: any;
  headers: {
    [k: string]: any;
  };
  body: any;
}

interface ChatDBSchema extends DBSchema {
  messages: {
    key: string;
    value: ChatMessage;
    indexes: {
      'by-timestamp': number;
    };
  };
  //TODO: Implement session and message grouping if time allows
  sessions: {
    key: string;
    value: ChatSession;
    indexes: {
      'by-last-updated': number;
    };
  };
  'offline-requests': {
    key: number;
    value: {
      request: Request;
      timestamp: number;
      status: 'pending' | 'complete';
    };
    indexes: {
      'by-timestamp': number;
    };
  };
}

const DB_NAME = 'chat-cache';
const DB_VERSION = 1;

export async function initDB() {
  return openDB<ChatDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const messagesStore = db.createObjectStore('messages', {
        keyPath: 'id',
      });
      messagesStore.createIndex('by-timestamp', 'timestamp');

      const sessionsStore = db.createObjectStore('sessions', {
        keyPath: 'id',
      });
      sessionsStore.createIndex('by-last-updated', 'lastUpdated');

      const offlineRequestsStore = db.createObjectStore('offline-requests', {
        keyPath: 'timestamp',
      });

      offlineRequestsStore.createIndex('by-timestamp', 'timestamp');
    },
  });
}
