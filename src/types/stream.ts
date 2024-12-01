import { Message } from 'ai';

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
