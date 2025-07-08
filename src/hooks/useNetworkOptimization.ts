import { useState, useEffect } from 'react';

interface NetworkInfo {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export const useNetworkOptimization = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
      });
    };

    const handleOnline = () => setNetworkInfo(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setNetworkInfo(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    updateNetworkInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  // Determine if we should use optimized loading strategies
  const shouldOptimize = networkInfo.effectiveType === 'slow-2g' || 
                        networkInfo.effectiveType === '2g' || 
                        (networkInfo.downlink && networkInfo.downlink < 1);

  return {
    networkInfo,
    shouldOptimize,
    isSlowConnection: shouldOptimize
  };
};