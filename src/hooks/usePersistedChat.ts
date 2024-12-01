import { ChatMessage as Message } from '@/types/db';
import { useEffect, useState } from 'react';
import { getMessages, saveMessage } from '@/lib/db/operations';
import { useStream } from '@/hooks';

const usePersistedChat = (options = {}) => {
  const chatData = useStream({
    ...options,
    onFinish: async (message) => {
      try {
        const messageToSave = {
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: Date.now(),
        };
        await saveMessage(messageToSave);
      } catch (error) {
        console.error('Failed to persist message:', error);
      }
    },
  });

  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  // Load messages from IndexedDB on mount
  useEffect(() => {
    async function loadCachedMessages() {
      try {
        setIsHistoryLoading(true);
        const cached = await getMessages();
        if (cached && cached.length > 0) {
          const sortedMessages = cached
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
        // Added as a ux touch. So that we can see the loader :-)
        setTimeout(() => {
          setIsHistoryLoading(false);
        }, 2000);
      }
    }

    loadCachedMessages();
  }, []);

  return { ...chatData, isHistoryLoading };
};

export default usePersistedChat;
