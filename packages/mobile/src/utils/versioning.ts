import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import { Platform } from 'react-native';

class Versioning {
  getHumanVersion = async () => PJSON_VERSION;

  getDist = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { androidBuildNumber, iosBuildNumber } = require('../../app.json');
    return (
      Platform.OS === 'ios' ? iosBuildNumber : androidBuildNumber
    ).toString();
  };
}

// TODO: component can later be used to notify users of what's new
export const PreviousVersion: React.FC = () => {
  useEffect(() => {
    AsyncStorage.setItem('@whitewater-guide/version', PJSON_VERSION).catch(
      () => {
        // ignore
      },
    );
  }, []);
  return null;
};

export const versioning = new Versioning();
