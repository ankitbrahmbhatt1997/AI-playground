/**
 * Hook for showing toast notifications
 *
 * Provides a simple interface to show success/error/info toasts.
 * Must be used within ToastProvider context.
 * Auto-dismisses toasts after 3 seconds.
 *
 * @throws {Error} When used outside ToastProvider
 */

import { ToastContext } from '@/context/ToastContext';
import { useContext } from 'react';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export default useToast;
