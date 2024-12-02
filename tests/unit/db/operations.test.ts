import { saveMessage, getMessages, clearAllMessages } from '@/lib/db/operations';
import { ChatMessage } from '@/types/db';
import 'fake-indexeddb/auto';

describe('Database Operations', () => {
  beforeEach(async () => {
    await clearAllMessages();
  });

  describe('saveMessage', () => {
    it('should save a new message', async () => {
      const message: ChatMessage = {
        id: '1',
        content: 'Test message',
        role: 'user',
        timestamp: Date.now(),
      };

      await saveMessage(message);
      const messages = await getMessages();

      expect(messages).toHaveLength(1);
      expect(messages[0]).toEqual(message);
    });

    it('should update existing message', async () => {
      const message: ChatMessage = {
        id: '1',
        content: 'Original',
        role: 'user',
        timestamp: Date.now(),
      };

      await saveMessage(message);

      const updatedMessage = {
        ...message,
        content: 'Updated',
      };
      await saveMessage(updatedMessage);

      const messages = await getMessages();
      expect(messages).toHaveLength(1);
      expect(messages[0].content).toBe('Updated');
    });

    it('should handle empty content', async () => {
      const message: ChatMessage = {
        id: '1',
        content: '',
        role: 'user',
        timestamp: Date.now(),
      };

      await saveMessage(message);
      const messages = await getMessages();
      expect(messages).toHaveLength(1);
    });
  });

  describe('getMessages', () => {
    it('should return empty array when no messages', async () => {
      const messages = await getMessages();
      expect(messages).toEqual([]);
    });

    it('should return messages sorted by timestamp', async () => {
      const messages: ChatMessage[] = [
        {
          id: '2',
          content: 'Second',
          role: 'user',
          timestamp: 2000,
        },
        {
          id: '1',
          content: 'First',
          role: 'user',
          timestamp: 1000,
        },
      ];

      await Promise.all(messages.map(saveMessage));
      const retrieved = await getMessages();

      expect(retrieved).toHaveLength(2);
      expect(retrieved[0].content).toBe('First');
      expect(retrieved[1].content).toBe('Second');
    });
  });

  describe('clearAllMessages', () => {
    it('should clear all messages', async () => {
      const message: ChatMessage = {
        id: '1',
        content: 'Test',
        role: 'user',
        timestamp: Date.now(),
      };

      await saveMessage(message);
      await clearAllMessages();

      const messages = await getMessages();
      expect(messages).toHaveLength(0);
    });

    it('should work when no messages exist', async () => {
      await clearAllMessages();
      const messages = await getMessages();
      expect(messages).toHaveLength(0);
    });
  });

  describe('error handling', () => {
    it('should handle invalid message format', async () => {
      const invalidMessage = {
        id: '1',
        content: 'Test',
        // missing required fields: role and timestamp
      };

      await expect(async () => {
        await saveMessage(invalidMessage as ChatMessage);
      }).rejects.toThrow('Invalid message format: missing required fields');
    });
  });
});
