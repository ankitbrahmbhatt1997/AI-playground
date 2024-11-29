import { Message } from 'ai';
import Item from '@/components/messages/item';

interface ListProps {
  messages: Message[];
  isLoading?: boolean;
}

const List = ({ messages, isLoading }: ListProps) => {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto">
      {messages.map((message, index) => (
        <Item key={index} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default List;
