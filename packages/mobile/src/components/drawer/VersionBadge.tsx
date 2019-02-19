import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { Caption } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    height: 48,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 10,
  },
});

interface State {
  local: string | null;
  pending: string | null;
  remote: string | null;
}

const getPrettyVersion = () => {
  const version = DeviceInfo.getVersion();
  const build = DeviceInfo.getBuildNumber().toString();
  let result: string;
  if (Platform.OS === 'ios' || build.length < 9) {
    result = `${version}.${build}.`;
  } else {
    // '%d%03d%03d%02d' - from Fastfile
    const regexp = /(\d+)(\d{3})(\d{3})(\d{2})/;
    const [_, majorStr, minorStr, patchStr, buildStr]: any = build.match(
      regexp,
    );
    result = `${parseInt(majorStr, 10)}.${parseInt(minorStr, 10)}.${parseInt(
      patchStr,
      10,
    )}.${parseInt(buildStr, 10)}`;
  }
  return result;
};

class VersionBadge extends React.PureComponent<{}, State> {
  state: State = {
    local: null,
    pending: null,
    remote: null,
  };

  async componentDidMount() {
    await this.checkCodePush();
  }

  checkCodePush = async () => {
    try {
      const localPackage = await CodePush.getUpdateMetadata(
        CodePush.UpdateState.RUNNING,
      );
      const pendingPackage = await CodePush.getUpdateMetadata(
        CodePush.UpdateState.PENDING,
      );
      const remotePackage = await CodePush.checkForUpdate();
      this.setState({
        local: localPackage ? localPackage.label : null,
        pending: pendingPackage ? pendingPackage.label : null,
        remote: remotePackage ? remotePackage.label : null,
      });
    } catch (e) {
      /* Ignore */
    }
  };

  render() {
    const { local, pending, remote } = this.state;
    const version = `${getPrettyVersion()}${local || 'v0'} ${Config.ENV_NAME}`;
    return (
      <TouchableOpacity onPress={this.checkCodePush}>
        <View style={styles.container}>
          <Caption style={styles.text}>{version}</Caption>
          {pending && (
            <Caption
              style={styles.text}
            >{`${pending} is ready to install`}</Caption>
          )}
          {remote && (
            <Caption style={styles.text}>{`${remote} is available`}</Caption>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export default VersionBadge;
