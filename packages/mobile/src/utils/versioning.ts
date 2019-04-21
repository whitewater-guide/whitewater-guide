import CodePush from 'react-native-code-push';

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
    const { version } = require('../../package.json');
    // prefer ios build number, because they're incremented together but ios one looks better
    const { iosBuildNumber } = require('../../app.json');
    const { local, pending, remote } = await this.getCodePushVersion();
    return `${version}.${iosBuildNumber}${local || pending || remote || 'v0'}`;
  };

  getBuildNumber = () => {
    const { iosBuildNumber } = require('../../app.json');
    return iosBuildNumber;
  };

  getSentryVersion = async () => {
    const { version } = require('../../package.json');
    const { local, pending, remote } = await this.getCodePushVersion();
    return `${version}-codepush:${local || pending || remote || 'v0'}`;
  };
}

export const versioning = new Versioning();
