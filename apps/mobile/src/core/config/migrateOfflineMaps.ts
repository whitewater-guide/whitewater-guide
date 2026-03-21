import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineManager } from '@rnmapbox/maps';

const KEY = 'mapbox-migrated';

export default async function migrateOfflineMaps(): Promise<void> {
  try {
    const migrated = await AsyncStorage.getItem(KEY);
    if (!migrated) {
      await offlineManager.migrateOfflineCache();
      await AsyncStorage.setItem(KEY, '1');
    }
  } catch {}
}
