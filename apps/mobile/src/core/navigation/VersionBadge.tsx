import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import Config from 'react-native-ultimate-config';

import copyAndToast from '~/utils/copyAndToast';
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
}

class VersionBadge extends React.PureComponent<unknown, State> {
  state: State = {
    humanVersion: '',
  };

  async componentDidMount() {
    const humanVersion = await versioning.getHumanVersion();
    this.setState({ humanVersion });
  }

  showDetails = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { androidBuildNumber, iosBuildNumber } = require('../../../app.json');

    const info = `Version: ${PJSON_VERSION}
Build: ${iosBuildNumber} / ${androidBuildNumber}
Environment: ${Config.ENV_NAME}`;

    Alert.alert('Version info', info, [
      { text: 'Copy', onPress: () => copyAndToast(info) },
      { text: 'OK' },
    ]);
  };

  render() {
    const { humanVersion } = this.state;
    const version = [
      humanVersion,
      Config.ENV_NAME === 'production' ? '' : Config.ENV_NAME,
      '(details)',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <View style={styles.container}>
        <Caption style={styles.text} onPress={this.showDetails}>
          {version}
        </Caption>
      </View>
    );
  }
}

export default VersionBadge;
