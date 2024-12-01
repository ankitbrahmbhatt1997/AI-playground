import { ToastContext } from '@/components/providers/toast-provider';
import { useContext } from 'react';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export default useToast;
