import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, ChangeEvent } from 'react';

interface InputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const Input = ({ input, handleInputChange, handleSubmit, isLoading }: InputProps) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4">
      <Textarea
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
};

export default Input;
