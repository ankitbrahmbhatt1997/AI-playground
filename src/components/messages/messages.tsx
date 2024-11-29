import { Message } from 'ai';
import List from '@/components/messages/list';
import Input from '@/components/messages/input';
import { FormEvent, ChangeEvent } from 'react';

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
  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      <div className="flex-1 overflow-y-auto p-4">
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
