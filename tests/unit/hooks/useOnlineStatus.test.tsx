import { renderHook, act } from '@testing-library/react';
import useOnlineStatus from '@/hooks/useOnlineStatus';
import { OnlineStatusProvider, ToastProvider } from '@/context';
import { FC, ReactNode } from 'react';

describe('useOnlineStatus', () => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <ToastProvider>
      <OnlineStatusProvider>{children}</OnlineStatusProvider>
    </ToastProvider>
  );

  it('should return initial online status', () => {
    const { result } = renderHook(() => useOnlineStatus(), { wrapper: Wrapper });
    expect(result.current).toBe(navigator.onLine);
  });

  it('should update when online status changes', () => {
    const { result } = renderHook(() => useOnlineStatus(), { wrapper: Wrapper });

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });
});
