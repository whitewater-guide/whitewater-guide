import { AsyncStorage } from 'react-native';
import Firebase from 'react-native-firebase';

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
  let enabled = await Firebase.messaging().hasPermission();
  if (!enabled) {
    try {
      await Firebase.messaging().requestPermission();
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
