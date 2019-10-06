import messaging from '@react-native-firebase/messaging';
import { AsyncStorage } from 'react-native';

enum MessagingPermission {
  UNKNOWN = 1,
  ENABLED = 2,
  DISABLED = 3,
}

export const enablePushNotifications = async () => {
  let storedPermission = MessagingPermission.UNKNOWN;
  try {
    const permsStr = await AsyncStorage.getItem('@ww:pushPermission');
    if (permsStr) {
      storedPermission = parseInt(permsStr, 10);
    }
  } catch {}
  if (storedPermission !== MessagingPermission.UNKNOWN) {
    return;
  }
  let enabled = await messaging().hasPermission();
  if (!enabled) {
    try {
      await messaging().requestPermission();
      enabled = true;
    } catch {}
  }
  await AsyncStorage.setItem(
    '@ww:pushPermission',
    enabled
      ? MessagingPermission.ENABLED.toString()
      : MessagingPermission.DISABLED.toString(),
  );
};
