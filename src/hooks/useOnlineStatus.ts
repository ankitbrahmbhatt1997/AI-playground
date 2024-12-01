import { useContext } from 'react';
import { OnlineStatusContext } from '@/context/OnlineContext';

const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  return context.isOnline;
};

export default useOnlineStatus;
