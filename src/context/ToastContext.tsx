/**
 * Toast notification context and provider. Pairs up with useToast hook.
 *
 * Provides global toast notifications with:
 * - Success/Error/Info variants
 * - Auto-dismiss after 3 seconds
 * - Stacked notifications
 * - Tailwind styling
 *
 * @example
 * const { showToast } = useToast();
 * showToast('success', 'Operation completed!');
 */

'use client';

import { createContext, useState, useCallback } from 'react';
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const icons = {
  success: CheckCircledIcon,
  error: CrossCircledIcon,
  info: InfoCircledIcon,
};

export const ToastContext = createContext<{
  showToast: (type: ToastType, message: string) => void;
} | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];

          return (
            <div
              key={toast.id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg',
                {
                  'bg-green-500': toast.type === 'success',
                  'bg-red-500': toast.type === 'error',
                  'bg-blue-500': toast.type === 'info',
                }
              )}
            >
              <Icon className="h-4 w-4" />
              <p>{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
