import { renderHook, act } from '@testing-library/react';
import usePersistedChat from '@/hooks/usePersistedChat';
import { ToastProvider } from '@/context';
import { FC, ReactNode } from 'react';
import { getMessages, saveMessage } from '@/lib/db/operations';
import { ChatMessage } from '@/types/db';

jest.mock('@/lib/db/operations', () => ({
  getMessages: jest.fn(),
  saveMessage: jest.fn(),
  clearAllMessages: jest.fn(),
}));

describe('usePersistedChat', () => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load cached messages on mount', async () => {
    const cachedMessages = [
      { id: '1', content: 'Test 1', role: 'user', timestamp: 1000 },
      { id: '2', content: 'Test 2', role: 'assistant', timestamp: 2000 },
    ];

    (getMessages as jest.Mock).mockResolvedValue(cachedMessages);

    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.messages).toEqual(cachedMessages);
    expect(result.current.isHistoryLoading).toBe(false);
  });

  it('should handle empty cached messages', async () => {
    (getMessages as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.isHistoryLoading).toBe(false);
  });

  it('should handle database error when loading messages', async () => {
    (getMessages as jest.Mock).mockRejectedValue(new Error('Database error'));
    console.error = jest.fn(); // Mock console.error to prevent test output noise

    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.messages).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to load cached messages:',
      expect.any(Error)
    );
  });

  it('should handle save failure', async () => {
    (saveMessage as jest.Mock).mockRejectedValue(new Error('Save failed'));
    console.error = jest.fn();

    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    const newMessage: ChatMessage = {
      id: '1',
      content: 'Test message',
      role: 'user',
      timestamp: Date.now(),
    };

    await act(async () => {
      result.current.append(newMessage);
    });

    expect(console.error).toHaveBeenCalledWith('Failed to persist message:', expect.any(Error));
  });

  it('should not save empty messages', async () => {
    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    const emptyMessage: ChatMessage = {
      id: '1',
      content: '',
      role: 'user',
      timestamp: Date.now(),
    };

    await act(async () => {
      result.current.append(emptyMessage);
    });

    expect(saveMessage).not.toHaveBeenCalled();
  });

  it('should handle malformed messages', async () => {
    const malformedMessages = [
      { id: '1', content: 'Test 1' }, // missing role and timestamp
      { content: 'Test 2', role: 'user' }, // missing id
    ];

    (getMessages as jest.Mock).mockResolvedValue(malformedMessages);
    console.error = jest.fn();

    const { result } = renderHook(() => usePersistedChat(), { wrapper: Wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    expect(result.current.messages).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});
