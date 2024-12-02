import { render, screen, act } from '@testing-library/react';
import { ToastProvider } from '@/context';
import { useToast } from '@/hooks';
import { FC } from 'react';

// Test component that uses the toast hook
const TestComponent: FC = () => {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('success', 'Success toast')}>Show Success</button>
      <button onClick={() => showToast('error', 'Error toast')}>Show Error</button>
      <button onClick={() => showToast('info', 'Info toast')}>Show Info</button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should show and auto-dismiss toast', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show toast
    act(() => {
      screen.getByText('Show Success').click();
    });

    // Toast should be visible
    expect(screen.getByText('Success toast')).toBeInTheDocument();

    // Fast-forward 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Toast should be gone
    expect(screen.queryByText('Success toast')).not.toBeInTheDocument();
  });

  it('should show multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show multiple toasts
    act(() => {
      screen.getByText('Show Success').click();
      screen.getByText('Show Error').click();
      screen.getByText('Show Info').click();
    });

    // All toasts should be visible
    expect(screen.getByText('Success toast')).toBeInTheDocument();
    expect(screen.getByText('Error toast')).toBeInTheDocument();
    expect(screen.getByText('Info toast')).toBeInTheDocument();
  });

  it('should apply correct styles based on type', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Show Success').click();
      screen.getByText('Show Error').click();
      screen.getByText('Show Info').click();
    });

    // Check for correct background colors
    expect(screen.getByText('Success toast').parentElement).toHaveClass('bg-green-500');
    expect(screen.getByText('Error toast').parentElement).toHaveClass('bg-red-500');
    expect(screen.getByText('Info toast').parentElement).toHaveClass('bg-blue-500');
  });

  it('should throw error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within ToastProvider');

    consoleSpy.mockRestore();
  });
});
