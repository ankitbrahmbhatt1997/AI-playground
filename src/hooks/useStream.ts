import { useState, useCallback, useRef, useEffect } from 'react';
// import { Message } from 'ai';
import { ChatMessage as Message } from '@/types/db';
import { StreamOptions, LoadingState } from '@/types/stream';
import { createMessage, isValidMessage, processStreamChunk } from '@/utils/stream';

const useStream = ({ api = '/api/chat', onFinish, ...options }: StreamOptions) => {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<LoadingState>({ streaming: false, saving: false });
  const [error, setError] = useState<Error | null>(null);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const append = useCallback(
    (message: Message) => {
      if (!isValidMessage(message)) {
        throw new Error('Invalid message format');
      }

      // Update messages immediately
      setMessages((prev) => [...prev, message]);

      // Notify completion for EACH message individually. This is done so that user messages can be saved too!
      onFinish?.(message);
    },
    [onFinish]
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading((prev) => ({ ...prev, streaming: false }));
    }
  }, []);

  const reload = useCallback(async () => {
    const currentMessages = messagesRef.current;
    if (currentMessages.length < 2) return;

    const lastUserMessageIndex = [...currentMessages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserMessageIndex !== -1) {
      const userMessage = currentMessages[currentMessages.length - lastUserMessageIndex - 1];
      setError(null);
      await handleSubmit(userMessage.content);
    }
  }, []);

  const processStream = useCallback(
    async (response: Response, assistantMessage: Message, previousMessages: Message[]) => {
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let fullContent = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const content = processStreamChunk(value);
          fullContent += content;

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'assistant') {
              const updatedMessage = {
                ...lastMessage,
                content: fullContent,
                timestamp: Date.now(),
              };
              // Notify about the updated message
              onFinish?.(updatedMessage);
              return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
          });
        }

        const finalMessage = {
          ...assistantMessage,
          content: fullContent,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev.slice(0, -1), finalMessage]);
        // Final message notification is already handled by the append function
      } catch (err) {
        setMessages(previousMessages);
        throw err;
      }
    },
    [onFinish]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement> | string) => {
      if (e && typeof e !== 'string') {
        e.preventDefault();
      }

      try {
        const userInput = typeof e === 'string' ? e : input;
        if (!userInput.trim()) return;

        const previousMessages = messagesRef.current;
        abortControllerRef.current = new AbortController();
        setIsLoading({ streaming: true, saving: false });
        setError(null);

        // Create and append user message first
        const userMessage = {
          ...createMessage(userInput, 'user'),
          timestamp: Date.now(),
        };
        append(userMessage);
        setInput('');

        // Create empty assistant message
        const assistantMessage = {
          ...createMessage('', 'assistant'),
          timestamp: Date.now(),
        };
        append(assistantMessage);

        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...previousMessages, userMessage],
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error('Stream request failed');

        await processStream(response, assistantMessage, previousMessages);
        setIsLoading({ streaming: false, saving: false });
        abortControllerRef.current = null;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        setIsLoading({ streaming: false, saving: false });
        abortControllerRef.current = null;
      }
    },
    [input, api, append, processStream, onFinish, options.onError]
  );

  // Add online status state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Add online/offline event listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isLoading.streaming || isLoading.saving,
    isStreaming: isLoading.streaming,
    isSaving: isLoading.saving,
    error,
    stop,
    reload,
    append,
    setMessages,
    isOnline,
  };
};

export default useStream;
