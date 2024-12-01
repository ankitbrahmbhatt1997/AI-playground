import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { useState, memo } from 'react';

interface ItemProps {
  message: Message;
}

const Item = ({ message }: ItemProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!message.content) return null;

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
        {message.role === 'assistant' && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Copy message</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(Item);
