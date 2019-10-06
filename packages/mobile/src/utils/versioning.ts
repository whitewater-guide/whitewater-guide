import { useEffect } from 'react';
import { AsyncStorage, Platform } from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';

export interface CodePushVersion {
  local: string | null;
  pending: string | null;
  remote: string | null;
}

class Versioning {
  private _codePushVersion!: CodePushVersion;

  getCodePushVersion = async () => {
    if (this._codePushVersion) {
      return Promise.resolve(this._codePushVersion);
    }
    try {
      const localPackage = await CodePush.getUpdateMetadata(
        CodePush.UpdateState.RUNNING,
      );
      const pendingPackage = await CodePush.getUpdateMetadata(
        CodePush.UpdateState.PENDING,
      );
      const remotePackage = await CodePush.checkForUpdate();
      this._codePushVersion = {
        local: localPackage ? localPackage.label : null,
        pending: pendingPackage ? pendingPackage.label : null,
        remote: remotePackage ? remotePackage.label : null,
      };
    } catch (e) {
      this._codePushVersion = { local: null, pending: null, remote: null };
    }
    return this._codePushVersion;
  };

  getHumanVersion = async () => {
    // prefer ios build number, because they're incremented together but ios one looks better
    const { local, pending, remote } = await this.getCodePushVersion();
    return `${PJSON_VERSION} ${local || pending || remote || 'v0'}`;
  };

  getDist = () => {
    const { androidBuildNumber, iosBuildNumber } = require('../../app.json');
    return (Platform.OS === 'ios'
      ? iosBuildNumber
      : androidBuildNumber
    ).toString();
  };

  getSentryVersion = async () => {
    const { local, pending, remote } = await this.getCodePushVersion();
    return `${PJSON_VERSION}-${Config.ENV_NAME}-${local ||
      pending ||
      remote ||
      'v0'}`;
  };
}

// TODO: component can later be used to notify users of what's new
export const PreviousVersion: React.FC = () => {
  useEffect(() => {
    AsyncStorage.setItem('@whitewater-guide/version', PJSON_VERSION).catch(
      () => {},
    );
  }, []);
  return null;
};

export const versioning = new Versioning();
