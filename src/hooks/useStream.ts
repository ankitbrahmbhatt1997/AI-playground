import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from 'ai';
import { StreamOptions, LoadingState } from '@/types/stream';
import { createMessage, isValidMessage, processStreamChunk } from '@/utils/stream';

const useStream = ({ api = '/api/chat', ...options }: StreamOptions) => {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<LoadingState>({ streaming: false, saving: false });
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const append = useCallback((message: Message) => {
    if (!isValidMessage(message)) {
      throw new Error('Invalid message format');
    }
    setMessages((prev) => [...prev, message]);
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading((prev) => ({ ...prev, streaming: false }));
    }
  }, []);

  const reload = useCallback(
    async (options?: { preserveInput: boolean }) => {
      if (messages.length < 2) return;

      const lastUserMessageIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
      if (lastUserMessageIndex !== -1) {
        const userMessage = messages[messages.length - lastUserMessageIndex - 1];
        setError(null);
        if (!options?.preserveInput) setInput('');
        await handleSubmit(userMessage.content);
      }
    },
    [messages]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement> | string) => {
      try {
        e instanceof Event && e.preventDefault();
        const userInput = typeof e === 'string' ? e : input;
        if (!userInput.trim()) return;

        abortControllerRef.current = new AbortController();
        setIsLoading({ streaming: true, saving: false });
        setError(null);

        // Add user message
        const userMessage = createMessage(userInput, 'user');
        append(userMessage);
        setInput('');

        // Add assistant message
        const assistantMessage = createMessage('', 'assistant');
        append(assistantMessage);

        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error('Stream request failed');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader availible');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const content = processStreamChunk(value);

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'assistant') {
              const updatedMessage = {
                ...lastMessage,
                content: lastMessage.content + content,
              };
              if (!isValidMessage(updatedMessage)) {
                throw new Error('Invalid message update');
              }
              return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
          });
        }

        setIsLoading({ streaming: false, saving: false });
        abortControllerRef.current = null;
        options.onFinish?.(messages[messages.length - 1]);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        setIsLoading({ streaming: false, saving: false });
        abortControllerRef.current = null;
      }
    },
    [messages, input, options]
  );

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
  };
};

export default useStream;
