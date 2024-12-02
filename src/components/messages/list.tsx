import { Message } from 'ai';
import Item from '@/components/messages/item';
import LoaderDots from '@/components/ui/loader-dots';
import { memo } from 'react';

interface ListProps {
  messages: Message[];
  isLoading?: boolean;
}

const List = memo(
  ({ messages, isLoading }: ListProps) => {
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
  },
  (prev, next) => {
    // Different length means messages added/removed
    if (prev.messages.length !== next.messages.length) return false;

    // Loading state changed
    if (prev.isLoading !== next.isLoading) return false;

    // During streaming, last message is updated
    const lastIndex = prev.messages.length - 1;
    const prevLast = prev.messages[lastIndex];
    const nextLast = next.messages[lastIndex];

    // If streaming (content different), only re-render last message
    if (prevLast?.content !== nextLast?.content) return false;

    // Otherwise keep memoized version
    return true;
  }
);

List.displayName = 'List';

export default List;
