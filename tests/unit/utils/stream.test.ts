import { createMessage, isValidMessage, processStreamChunk } from '@/utils/stream';
import { Message } from 'ai';

describe('Stream Utils', () => {
  describe('createMessage', () => {
    it('should create a valid message with given content and role', () => {
      const message = createMessage('Hello', 'user');

      expect(message).toEqual({
        id: expect.any(String),
        content: 'Hello',
        role: 'user',
      });
    });

    it('should generate unique IDs for different messages', () => {
      const message1 = createMessage('Hello', 'user');
      const message2 = createMessage('Hi', 'user');

      expect(message1.id).not.toBe(message2.id);
    });
  });

  describe('isValidMessage', () => {
    it('should return true for valid messages', () => {
      const message: Message = {
        id: '123',
        content: 'Hello',
        role: 'user',
      };

      expect(isValidMessage(message)).toBe(true);
    });

    it('should return false for invalid messages', () => {
      const invalidMessage = {
        content: 'Hello',
      };

      expect(isValidMessage(invalidMessage)).toBe(false);
    });
  });

  describe('processStreamChunk', () => {
    it('should process stream chunks with 0: prefix', () => {
      const encoder = new TextEncoder();
      const chunk = encoder.encode('0:"Hello, World!"');

      expect(processStreamChunk(chunk)).toBe('Hello, World!');
    });

    it('should handle multiple lines in chunks', () => {
      const encoder = new TextEncoder();
      const chunk = encoder.encode('0:"Hello"\n0:", World!"');

      expect(processStreamChunk(chunk)).toBe('Hello, World!');
    });

    it('should ignore non-0: prefixed lines', () => {
      const encoder = new TextEncoder();
      const chunk = encoder.encode('1:ignored\n0:"Hello"\ne:metadata');

      expect(processStreamChunk(chunk)).toBe('Hello');
    });

    it('should handle empty chunks', () => {
      const encoder = new TextEncoder();
      const chunk = encoder.encode('');

      expect(processStreamChunk(chunk)).toBe('');
    });
  });
});
