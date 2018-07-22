import Firebase from 'react-native-firebase';

export const trackError = (origin: string, error: Error, componentStack?: string, isFatal?: boolean) => {
  if (__DEV__) {
    try {
      console.dir(error);
    } catch {
      console.log(error);
    }
  }
  Firebase.crashlytics().setStringValue('origin', origin);
  Firebase.crashlytics().setStringValue('stack', error.stack || '');
  Firebase.crashlytics().setBoolValue('isFatal', !!isFatal);
  if (componentStack) {
    Firebase.crashlytics().setStringValue('componentStack', componentStack);
  }
  Firebase.crashlytics().recordError(1, error.message);
};
