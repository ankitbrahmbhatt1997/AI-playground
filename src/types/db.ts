import { Message } from 'ai';

export interface ChatMessage extends Message {
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface DBSchema {
  messages: ChatMessage;
  sessions: ChatSession;
}
