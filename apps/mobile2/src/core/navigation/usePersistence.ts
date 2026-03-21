import type { NavigationState } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import Config from 'react-native-config';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();
const PERSISTENCE_KEY = 'wwguide2_nav_state';

export default function usePersistence() {
  const isE2E = Config.E2E_MODE === 'true';
  const [isReady, setIsReady] = useState(isE2E);
  const [initialState, setInitialState] = useState<
    NavigationState | undefined
  >();

  useEffect(() => {
    if (isReady) {
      return;
    }

    try {
      const stateStr = storage.getString(PERSISTENCE_KEY);
      if (stateStr) {
        setInitialState(JSON.parse(stateStr));
      }
    } finally {
      setIsReady(true);
    }
  }, [isReady]);

  const onStateChange = useCallback(
    (state: NavigationState | undefined) => {
      if (!isE2E && state) {
        storage.set(PERSISTENCE_KEY, JSON.stringify(state));
      }
    },
    [isE2E],
  );

  return {
    ready: isReady,
    state: initialState,
    onStateChange,
  };
}
