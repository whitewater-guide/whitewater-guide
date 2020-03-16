import AsyncStorage from '@react-native-community/async-storage';
import { useCallback, useEffect, useState } from 'react';
import Config from 'react-native-config';

const PERSISTENCE_KEY = 'wwguide1';

export default () => {
  const [isReady, setIsReady] = useState(Config.E2E_MODE === 'true');
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const stateStr = await AsyncStorage.getItem(PERSISTENCE_KEY);
        setInitialState(stateStr ? JSON.parse(stateStr) : null);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const onStateChange = useCallback(
    (state: any) =>
      AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)),
    [],
  );

  return {
    ready: isReady,
    state: initialState,
    onStateChange,
  };
};
