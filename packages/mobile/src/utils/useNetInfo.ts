import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetInfo() {
  const [connected, setConnected] = useState(false);

  useEffect((): (() => void) => {
    const { remove } = NetInfo.isConnected.addEventListener(
      'connectionChange',
      setConnected,
    );
    return remove;
  }, []);

  return connected;
}
