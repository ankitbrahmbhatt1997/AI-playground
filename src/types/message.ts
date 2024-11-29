export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  role: Role;
  createdAt: Date;
  // For streaming state
  isStreaming?: boolean;
  // For code blocks and other content
  tokens?: number;
  containsCode?: boolean;
}

export interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export interface MessageProps {
  message: Message;
  isLast?: boolean;
}
