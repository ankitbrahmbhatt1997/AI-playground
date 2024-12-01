'use client';

import usePersistedChat from '@/hooks/usePersistedChat';
import Messages from '@/components/messages/messages';
import { Button } from '@/components/ui/button';
import { clearAllMessages } from '@/lib/db/operations';
import { useCallback } from 'react';
import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { useToast } from '@/hooks';

const Playground = () => {
  const { showToast } = useToast();

  const {
    messages,
    input,
    handleInputChange: onInputChange,
    handleSubmit: onSubmit,
    isLoading,
    isHistoryLoading,
    stop,
  } = usePersistedChat({
    api: '/api/chat',
  });

  const handleNewChat = useCallback(async () => {
    try {
      await clearAllMessages();
      window.location.reload();
    } catch (error) {
      showToast('error', 'Failed to clear messages');
    }
  }, [showToast]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-start justify-between py-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleNewChat}>
            Start New Chat
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden pt-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="md:order-1">
            <ErrorBoundary type="messages">
              <Messages
                messages={messages}
                input={input}
                handleInputChange={onInputChange}
                handleSubmit={onSubmit}
                isLoading={isLoading}
                isHistoryLoading={isHistoryLoading}
                stopGenerating={stop}
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
