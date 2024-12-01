import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, ChangeEvent, useState, memo, KeyboardEvent } from 'react';
import { useToast } from '@/hooks';

interface InputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stopGenerating: () => void;
}

const Input = memo(
  ({ input, handleInputChange, handleSubmit, isLoading, stopGenerating }: InputProps) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const { showToast } = useToast();

    const handleStop = async (e: React.MouseEvent) => {
      e.preventDefault();
      setIsCancelling(true);
      showToast('info', 'Oops! You didn`t like what I was saying 😱');
      await stopGenerating();
      setIsCancelling(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.trim()) {
          const syntheticEvent = {
            preventDefault: () => {},
            currentTarget: e.currentTarget.form,
          } as FormEvent<HTMLFormElement>;

          handleSubmit(syntheticEvent);
        }
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4">
        <Textarea
          tabIndex={0}
          rows={1}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Send a message... (Enter to send, Shift+Enter for new line)"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none rounded-md border border-input bg-background px-3 py-2"
        />
        {isLoading ? (
          <Button type="button" onClick={handleStop} disabled={isCancelling} variant="secondary">
            {isCancelling ? 'Stopping...' : 'Stop'}
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        )}
      </form>
    );
  },
  (prev, next) => {
    return (
      prev.input === next.input &&
      prev.isLoading === next.isLoading &&
      prev.handleInputChange === next.handleInputChange &&
      prev.handleSubmit === next.handleSubmit &&
      prev.stopGenerating === next.stopGenerating
    );
  }
);

Input.displayName = 'Input';

export default Input;
