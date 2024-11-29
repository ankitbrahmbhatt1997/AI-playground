import { Message } from 'ai';
import Item from '@/components/messages/item';
import LoaderDots from '@/components/ui/loader-dots';

interface ListProps {
  messages: Message[];
  isLoading?: boolean;
}

const List = ({ messages, isLoading }: ListProps) => {
  return (
    <div className="flex-1 space-y-5">
      {messages.map((message, index) => (
        <Item key={index} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          {messages.length === 0 ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <LoaderDots />
          )}
        </div>
      )}
    </div>
  );
};

export default List;
