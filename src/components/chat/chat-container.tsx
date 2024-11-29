import { Message } from 'ai';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { FormEvent, ChangeEvent } from 'react';

interface ChatContainerProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatContainer({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatContainerProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <div className="border-t">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
