/**
 * Hook for tracking online/offline status
 *
 * Provides real-time updates for network connectivity.
 * Used for offline mode and background sync features.
 * Must be used within OnlineStatusProvider.
 *
 * @returns {boolean} Current online status
 */

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
