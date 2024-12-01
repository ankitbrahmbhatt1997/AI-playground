import { Message } from 'ai';

export const createMessage = (content: string, role: 'user' | 'assistant'): Message => ({
  id: Math.random().toString(36).slice(2),
  content,
  role,
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
