import React from 'react';
import { Alert, Clipboard, StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import Config from 'react-native-ultimate-config';
import { versioning } from '~/utils/versioning';

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
  humanVersion: string;
  sentryVersion: string;
}

class VersionBadge extends React.PureComponent<{}, State> {
  state: State = {
    humanVersion: '',
    sentryVersion: '',
  };

  async componentDidMount() {
    const humanVersion = await versioning.getHumanVersion();
    const sentryVersion = await versioning.getSentryVersion();
    this.setState({ humanVersion, sentryVersion });
  }

  showDetails = () => {
    const { sentryVersion } = this.state;
    const { androidBuildNumber, iosBuildNumber } = require('../../../app.json');

    const info = `Version: ${PJSON_VERSION}
Build: ${iosBuildNumber} / ${androidBuildNumber}
Environment: ${Config.ENV_NAME}
Sentry: ${sentryVersion}`;

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
