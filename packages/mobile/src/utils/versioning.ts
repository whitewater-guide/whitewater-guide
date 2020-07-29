import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-ultimate-config';

class Versioning {
  getHumanVersion = async () => {
    return PJSON_VERSION;
  };

  getDist = () => {
    const { androidBuildNumber, iosBuildNumber } = require('../../app.json');
    return (Platform.OS === 'ios'
      ? iosBuildNumber
      : androidBuildNumber
    ).toString();
  };

  getSentryVersion = async () => {
    return `${PJSON_VERSION}-${Config.ENV_NAME}`;
  };
}

// TODO: component can later be used to notify users of what's new
export const PreviousVersion: React.FC = () => {
  useEffect(() => {
    AsyncStorage.setItem(
      '@whitewater-guide/version',
      PJSON_VERSION,
    ).catch(() => {});
  }, []);
  return null;
};

export const versioning = new Versioning();
