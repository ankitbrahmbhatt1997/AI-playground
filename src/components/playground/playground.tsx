'use client';

import usePersistedChat from '@/hooks/use-persisted-chat';
import Messages from '@/components/messages/messages';
import { Button } from '@/components/ui/button';
import { clearAllMessages } from '@/lib/db/operations';
import { useCallback } from 'react';

const Playground = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, isHistoryLoading, stop } =
    usePersistedChat({
      api: '/api/chat',
    });

  const handleNewChat = useCallback(async () => {
    try {
      await clearAllMessages();
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-start justify-between py-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold">Playground</h2>
        <Button variant="outline" onClick={handleNewChat}>
          Start New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-hidden pt-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="md:order-1">
            <Messages
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isHistoryLoading={isHistoryLoading}
              stopGenerating={stop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
