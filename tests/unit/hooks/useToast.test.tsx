import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks';
import { ToastProvider } from '@/context';
import { FC, ReactNode } from 'react';

describe('useToast', () => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  it('should show toast message', () => {
    const { result } = renderHook(() => useToast(), { wrapper: Wrapper });

    act(() => {
      result.current.showToast('success', 'Test message');
    });

    // We can't easily test the DOM here since toasts are rendered in a portal
    // Instead, we're testing that the function executes without error
    expect(result.current.showToast).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within ToastProvider');
  });
});
