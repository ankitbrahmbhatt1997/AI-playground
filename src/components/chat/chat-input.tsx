import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRef, FormEvent, ChangeEvent } from 'react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4">
      <Textarea
        ref={textareaRef}
        tabIndex={0}
        rows={1}
        value={input}
        onChange={handleInputChange}
        placeholder="Send a message..."
        spellCheck={false}
        className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background px-3 py-2"
      />
      <Button type="submit" disabled={isLoading}>
        Send
      </Button>
    </form>
  );
}
