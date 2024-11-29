import { Message } from 'ai';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: Message;
}

export function MessageItem({ message }: MessageProps) {
  return (
    <div
      className={cn(
        'group relative mb-4 flex items-start md:mb-6',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex w-full max-w-[85%] flex-col gap-2 rounded-lg px-4 py-3',
          message.role === 'user'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-background text-foreground'
        )}
      >
        <div className="prose dark:prose-invert break-words">
          {message.role === 'assistant' && (
            <span className="mb-2 block text-xs font-medium text-muted-foreground">AI</span>
          )}
          {message.content}
        </div>
      </div>
    </div>
  );
}
