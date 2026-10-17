import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** `true`/`false` once known, `null` while unknown (don't flash an offline banner at startup). */
export function useIsOnline(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        if (state.isConnected === null) return;
        setOnline(state.isConnected && state.isInternetReachable !== false);
      }),
    [],
  );
  return online;
}
