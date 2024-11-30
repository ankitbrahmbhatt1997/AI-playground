import { useChat, Message } from 'ai/react';
import { useEffect, useState } from 'react';
import { getMessages, saveIfNotExists, saveMessage } from '@/lib/db/operations';

const usePersistedChat = (options = {}) => {
  // TODO Unsure about the requirements. Using useChat for now as it is part of vercel SDK
  const chatData = useChat({
    ...options,
  });

  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  const { messages, setMessages } = chatData;

  // Load messages from IndexedDB on mount
  useEffect(() => {
    async function loadCachedMessages() {
      try {
        setIsHistoryLoading(true);
        const cached = await getMessages();
        if (cached && cached.length > 0) {
          const sortedMessages = cached
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(({ content, role, id }) => ({
              content,
              role,
              id,
            })) as Message[];

          setMessages(sortedMessages);
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

  // Persist new messages to IndexedDB
  // TODO - Try if this can be implemented using an inbuilt usechat callback like onFinish
  useEffect(() => {
    async function persistMessage(message: Message) {
      try {
        const messageToSave = {
          id: message.id,
          content: message.content,
          role: message.role,
          timestamp: Date.now(),
        };
        // console.log('Dank message to save', messageToSave);
        await saveMessage(messageToSave);
      } catch (error) {
        console.error('Failed to persist message:', error);
      }
    }

    if (messages.length > 0) {
      // console.log('Dank all messages', messages);
      const lastMessage = messages[messages.length - 1];
      persistMessage(lastMessage);
    }
  }, [messages, messages.length]);

  return { ...chatData, isHistoryLoading };
};

export default usePersistedChat;
