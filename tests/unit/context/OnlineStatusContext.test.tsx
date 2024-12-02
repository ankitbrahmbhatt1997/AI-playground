import { render, act } from '@testing-library/react';
import { OnlineStatusProvider, ToastProvider } from '@/context';
import { useOnlineStatus } from '@/hooks';
import { FC } from 'react';

// Test component that uses the online status hook
const TestComponent: FC = () => {
  const isOnline = useOnlineStatus();
  return <div data-testid="status">{isOnline ? 'online' : 'offline'}</div>;
};

describe('OnlineStatusContext', () => {
  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  it('should provide initial online status', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <OnlineStatusProvider>
          <TestComponent />
        </OnlineStatusProvider>
      </ToastProvider>
    );

    expect(getByTestId('status')).toHaveTextContent('online');
  });

  it('should update status when going offline', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <OnlineStatusProvider>
          <TestComponent />
        </OnlineStatusProvider>
      </ToastProvider>
    );

    act(() => {
      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    expect(getByTestId('status')).toHaveTextContent('offline');
  });

  it('should update status when coming back online', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <OnlineStatusProvider>
          <TestComponent />
        </OnlineStatusProvider>
      </ToastProvider>
    );

    // Go offline first
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    // Then come back online
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));
    });

    expect(getByTestId('status')).toHaveTextContent('online');
  });

  it('should show toast notifications on status change', () => {
    const { getByText } = render(
      <ToastProvider>
        <OnlineStatusProvider>
          <TestComponent />
        </OnlineStatusProvider>
      </ToastProvider>
    );

    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      window.dispatchEvent(new Event('offline'));
    });

    expect(getByText(/You are offline/)).toBeInTheDocument();

    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true });
      window.dispatchEvent(new Event('online'));
    });

    expect(getByText(/Back online!/)).toBeInTheDocument();
  });
});
