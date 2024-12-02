/**
 * Hook for chat persistence and offline support
 *
 * Combines useStream with IndexedDB persistence.
 * Handles:
 * - Message caching
 * - History loading
 * - Offline message queueing
 *
 * Built on top of useStream for core chat functionality.
 */

// TODO: This too can churn out 2 or 3 more utils.

import { ChatMessage as Message } from '@/types/db';
import { useEffect, useState } from 'react';
import { getMessages, saveMessage } from '@/lib/db/operations';
import { useStream } from '@/hooks';

const usePersistedChat = (options = {}) => {
  const chatData = useStream({
    ...options,
    onFinish: async (message) => {
      try {
        if (message.content && message.content.trim() !== '') {
          const messageToSave = {
            id: message.id,
            content: message.content,
            role: message.role,
            timestamp: Date.now(),
          };
          await saveMessage(messageToSave);
        }
      } catch (error) {
        console.error('Failed to persist message:', error);
      }
    },
  });

  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  // Load messages from IndexedDB on mount
  useEffect(() => {
    const loadCachedMessages = async () => {
      try {
        setIsHistoryLoading(true);
        const cached = await getMessages();
        if (cached && cached.length > 0) {
          const validMessages = cached.filter((message) => {
            const isValid = message.id && message.content && message.role && message.timestamp;
            if (!isValid) {
              console.error('Malformed message found:', message);
            }
            return isValid;
          });

          const sortedMessages = validMessages
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ content, role, id, timestamp }) => ({
              content,
              role,
              id,
              timestamp,
            })) as Message[];

          chatData.setMessages(sortedMessages);
        }
      } catch (error) {
        console.error('Failed to load cached messages:', error);
      } finally {
        setTimeout(() => {
          setIsHistoryLoading(false);
        }, 2000);
      }
    };

    loadCachedMessages();
  }, []);

  return { ...chatData, isHistoryLoading };
};

export default usePersistedChat;
