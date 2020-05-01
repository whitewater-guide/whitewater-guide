import { Alert, Clipboard, StyleSheet, View } from 'react-native';
import { CodePushVersion, versioning } from '../../utils/versioning';

import { Caption } from 'react-native-paper';
import Config from 'react-native-ultimate-config';
import React from 'react';

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
  codePushVersion: CodePushVersion;
  humanVersion: string;
  sentryVersion: string;
}

class VersionBadge extends React.PureComponent<{}, State> {
  state: State = {
    codePushVersion: {
      local: null,
      pending: null,
      remote: null,
    },
    humanVersion: '',
    sentryVersion: '',
  };

  async componentDidMount() {
    const codePushVersion = await versioning.getCodePushVersion();
    const humanVersion = await versioning.getHumanVersion();
    const sentryVersion = await versioning.getSentryVersion();
    this.setState({ humanVersion, codePushVersion, sentryVersion });
  }

  showDetails = () => {
    const { codePushVersion, sentryVersion } = this.state;
    const { local, pending, remote } = codePushVersion;
    const { androidBuildNumber, iosBuildNumber } = require('../../../app.json');

    const info = `Version: ${PJSON_VERSION}
Build: ${iosBuildNumber} / ${androidBuildNumber}
Environment: ${Config.ENV_NAME}
Sentry: ${sentryVersion}
CodePush local: ${local}
CodePush pending: ${pending}
CodePush remote: ${remote}`;

    Alert.alert('Version info', info, [
      { text: 'Copy', onPress: () => Clipboard.setString(info) },
      { text: 'OK' },
    ]);
  };

  render() {
    const { humanVersion } = this.state;
    const version = `${humanVersion} ${Config.ENV_NAME}`;
    return (
      <View style={styles.container}>
        <Caption
          style={styles.text}
          onPress={this.showDetails}
        >{`${version} (details)`}</Caption>
      </View>
    );
  }
}

export default VersionBadge;
