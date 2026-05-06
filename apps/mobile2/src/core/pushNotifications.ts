import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  hasPermission,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid,Platform } from 'react-native';

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return res === PermissionsAndroid.RESULTS.GRANTED;
  }
  const messaging = getMessaging();
  let status = await hasPermission(messaging);
  if (status === AuthorizationStatus.NOT_DETERMINED) {
    status = await requestPermission(messaging);
  }
  const ok =
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL;
  if (ok && Platform.OS === 'ios') {
    await registerDeviceForRemoteMessages(messaging);
  }
  return ok;
}

export { getMessaging, getToken, onTokenRefresh };
