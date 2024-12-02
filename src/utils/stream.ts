/**
 * Stream processing utilities for real-time chat
 *
 * Handles stream processing logic including:
 * - Message creation and validation
 * - Stream chunk processing
 * - Text decoding and formatting
 *
 * Used primarily by useStream hook for real-time updates.
 *
 * @module utils/stream
 */

import { ChatMessage as Message } from '@/types/db';

export const createMessage = (content: string, role: 'user' | 'assistant'): Message => ({
  id: Math.random().toString(36).slice(2),
  content,
  role,
  timestamp: Date.now(),
});

export const isValidMessage = (message: Message): boolean => {
  return (
    typeof message.id === 'string' &&
    typeof message.content === 'string' &&
    (message.role === 'user' || message.role === 'assistant')
  );
};

export const processStreamChunk = (chunk: Uint8Array): string => {
  const text = new TextDecoder().decode(chunk);
  const lines = text.split('\n').filter((line) => line.trim());

  let content = '';
  for (const line of lines) {
    if (line.startsWith('0:')) {
      content += line.slice(2).replace(/^"|"$/g, '');
    }
  }
  return content;
};
