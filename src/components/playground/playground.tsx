'use client';

import usePersistedChat from '@/hooks/usePersistedChat';
import Messages from '@/components/messages/messages';
import { Button } from '@/components/ui/button';
import { clearAllMessages } from '@/lib/db/operations';
import { useCallback, useState } from 'react';
import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { useToast } from '@/hooks';
import { useOnlineStatus } from '@/hooks';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Playground = () => {
  const { showToast } = useToast();
  const isOnline = useOnlineStatus();
  const [startingNewChat, setStartingNewChat] = useState(false);

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
      setStartingNewChat(true);
      await clearAllMessages();
      window.location.reload();
    } catch (error) {
      showToast('error', 'Failed to clear messages');
    } finally {
      setStartingNewChat(false);
    }
  }, [showToast]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-start justify-between py-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold">AI Playground</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              data-testid="online-status"
              className={cn(
                'h-2 w-2 rounded-full',
                isOnline ? 'animate-pulse bg-green-500' : 'bg-red-500'
              )}
            />
            <span data-testid="status" className="text-sm text-muted-foreground">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="space-x-2">
          <Button
            data-testid="new-chat-button"
            variant="outline"
            onClick={handleNewChat}
            disabled={startingNewChat}
          >
            {startingNewChat ? <Loader2 className="animate-spin" /> : 'Start New Chat'}
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
