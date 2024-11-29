import { Message } from 'ai';
import List from '@/components/messages/list';
import Input from '@/components/messages/input';
import { FormEvent, ChangeEvent, useRef, useEffect } from 'react';

interface MessagesProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const Messages = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col rounded-lg border bg-background">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-scroll scroll-smooth p-3">
        <List messages={messages} isLoading={isLoading} />
      </div>
      <div className="border-t">
        <Input
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Messages;
