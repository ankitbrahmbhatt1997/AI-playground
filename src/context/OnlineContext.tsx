import { createContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks';

interface OnlineStatusContextType {
  isOnline: boolean;
}

export const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export default function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOnline = async () => {
      showToast('success', 'Back online! Messages will sync automatically');
      setIsOnline(true);

      if ('serviceWorker' in navigator) {
        try {
          // const registration = await navigator.serviceWorker.ready;

          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('trigger-sync');
          } else {
          }
        } catch (error) {}
      } else {
      }
    };

    const handleOffline = () => {
      showToast('info', 'You are offline. Messages will be saved and sent later');
      setIsOnline(false);
    };

    if (!navigator.onLine) {
      handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>{children}</OnlineStatusContext.Provider>
  );
}
