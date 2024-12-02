import { renderHook, act } from '@testing-library/react';
import useStream from '@/hooks/useStream';
import { ToastProvider } from '@/context';
import { FC, ReactNode } from 'react';

//TODO: Superficial test cases. Need more robust testing and need to mock the stream response.

describe('useStream', () => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useStream({ api: '/api/chat' }), { wrapper: Wrapper });

    expect(result.current.messages).toEqual([]);
    expect(result.current.input).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle input changes', () => {
    const { result } = renderHook(() => useStream({ api: '/api/chat' }), { wrapper: Wrapper });

    act(() => {
      result.current.handleInputChange({ target: { value: 'test' } } as any);
    });

    expect(result.current.input).toBe('test');
  });

  it('should handle message submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        body: {
          getReader: () => ({
            read: () =>
              Promise.resolve({
                done: true,
                value: new TextEncoder().encode('0:"Test response"'),
              }),
          }),
        },
      })
    );

    const { result } = renderHook(() => useStream({ api: '/api/chat' }), { wrapper: Wrapper });

    act(() => {
      result.current.handleInputChange({ target: { value: 'test message' } } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as any);
    });

    expect(result.current.messages).toHaveLength(2); // User message + AI response
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('test message');
  });

  it('should handle stream cancellation', async () => {
    const { result } = renderHook(() => useStream({ api: '/api/chat' }), { wrapper: Wrapper });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
