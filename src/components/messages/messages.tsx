import { Message } from 'ai';
import List from '@/components/messages/list';
import Input from '@/components/messages/input';
import Metrics from '@/components/messages/metrics';
import { FormEvent, ChangeEvent, useRef, useEffect, useState } from 'react';
import LoaderDots from '../ui/loader-dots';

interface MessagesProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isHistoryLoading: boolean;
  stopGenerating: () => void;
}

const Messages = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isHistoryLoading,
  stopGenerating,
}: MessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startTime, setStartTime] = useState<number | undefined>();
  const [tokenCount, setTokenCount] = useState(0);

  useEffect(() => {
    if (isLoading && !startTime) {
      setStartTime(Date.now());
      setTokenCount(0);
    } else if (!isLoading) {
      setStartTime(undefined);
    }
  }, [isLoading, startTime]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update token count when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setTokenCount(lastMessage.content.length / 4);
    }
  }, [messages]);

  if (isHistoryLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoaderDots text="Loading older messages" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col rounded-lg border bg-background">
      <div ref={scrollRef} className="scrollbar-hide min-h-0 flex-1 overflow-y-scroll p-3">
        <List messages={messages} isLoading={isLoading} />
      </div>
      {isLoading && messages.length > 0 && (
        <div className="border-t px-4 py-2">
          <Metrics isStreaming={isLoading} startTime={startTime} tokenCount={tokenCount} />
        </div>
      )}
      <div className="border-t">
        <Input
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stopGenerating={stopGenerating}
        />
      </div>
    </div>
  );
};

export default Messages;
