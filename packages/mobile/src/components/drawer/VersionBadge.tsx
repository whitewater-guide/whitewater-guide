import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';
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
  const pjson = require('../../../package.json');
  const ajson = require('../../../app.json');
  return (
    pjson.version +
    '.' +
    (Platform.OS === 'ios' ? ajson.iosBuildNumber : ajson.androidBuildNumber)
  );
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
    const jsVersion = getPrettyVersion();
    const version = `${jsVersion}${local || 'v0'} ${Config.ENV_NAME}`;
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
