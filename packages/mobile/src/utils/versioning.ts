import { Platform } from 'react-native';
import CodePush from 'react-native-code-push';

export interface CodePushVersion {
  local: string | null;
  pending: string | null;
  remote: string | null;
}

class Versioning {
  private _codePushVersion!: CodePushVersion;
  private _jsVersion!: string;

  getJsVersion() {
    if (!this._jsVersion) {
      const pjson = require('../../package.json');
      const ajson = require('../../app.json');
      this._jsVersion =
        pjson.version +
        '.' +
        (Platform.OS === 'ios'
          ? ajson.iosBuildNumber
          : ajson.androidBuildNumber);
    }
    return this._jsVersion;
  }

  async getCodePushVersion() {
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
  }
}

export const versioning = new Versioning();
