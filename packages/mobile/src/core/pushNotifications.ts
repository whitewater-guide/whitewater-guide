import messaging from '@react-native-firebase/messaging';

export const enablePushNotifications = async () => {
  const enabled = await messaging().hasPermission();
  if (!enabled) {
    try {
      const result = await messaging().requestPermission();
      if (result) {
        await messaging().registerForRemoteNotifications();
      }
    } catch {}
  }
};
