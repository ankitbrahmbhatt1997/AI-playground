import { ChatMessage as Message } from './db';

export interface StreamOptions {
  api?: string;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
  onFinish?: (message: Message) => void;
}

export interface LoadingState {
  streaming: boolean;
  saving: boolean;
}

export interface StreamResult {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | string) => Promise<void>;
  isLoading: boolean;
  isStreaming: boolean;
  isSaving: boolean;
  error: Error | null;
  stop: () => void;
  reload: () => Promise<void>;
  append: (message: Message) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isOnline: boolean;
}
