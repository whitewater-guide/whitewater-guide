import { AppState, AppStateStatus } from 'react-native';

const waitUntilActive = (timeout?: number): Promise<boolean> => {
  let listener: any;
  const statePromise = new Promise<boolean>((resolve) => {
    if (AppState.currentState === 'active') {
      resolve(true);
    } else {
      listener = (status: AppStateStatus) => {
        if (status === 'active') {
          AppState.removeEventListener('change', listener);
          resolve(true);
        }
      };
      AppState.addEventListener('change', listener);
    }
  });
  if (timeout) {
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (listener) {
          AppState.removeEventListener('change', listener);
        }
        resolve(false);
      }, timeout);
    });
    return Promise.race([statePromise, timeoutPromise]);
  } else {
    return statePromise;
  }
};

export default waitUntilActive;
