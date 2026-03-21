import Mapbox from '@rnmapbox/maps';
import { LogBox, UIManager } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import Config from 'react-native-ultimate-config';

import migrateOfflineMaps from './migrateOfflineMaps';

const configMisc = () => {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  Mapbox.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
  Mapbox.setTelemetryEnabled(false);
  migrateOfflineMaps();

  Settings.initializeSDK();

  // Ignore all log notifications:
  LogBox.ignoreAllLogs();
};

export default configMisc;
