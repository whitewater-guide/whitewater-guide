import { AppState, AppStateStatus } from 'react-native';

const waitUntilActive = () =>
  new Promise((resolve) => {
    if (AppState.currentState === 'active') {
      resolve();
    } else {
      const listener = (state: AppStateStatus) => {
        if (state === 'active') {
          AppState.removeEventListener('change', listener);
          resolve();
        }
      };
    }
  });

export default waitUntilActive;
