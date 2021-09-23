import { AppState, AppStateStatus, EmitterSubscription } from 'react-native';

const waitUntilActive = (timeout?: number): Promise<boolean> => {
  let subscription: EmitterSubscription | undefined;

  const statePromise = new Promise<boolean>((resolve) => {
    if (AppState.currentState === 'active') {
      resolve(true);
    } else {
      const listener = (status: AppStateStatus) => {
        if (status === 'active') {
          subscription?.remove();
          resolve(true);
        }
      };
      subscription = AppState.addEventListener('change', listener);
    }
  });

  if (timeout) {
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        subscription?.remove();
        resolve(false);
      }, timeout);
    });
    return Promise.race([statePromise, timeoutPromise]);
  }
  return statePromise;
};

export default waitUntilActive;
