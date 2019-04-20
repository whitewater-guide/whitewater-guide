import React from 'react';
import { StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { Caption } from 'react-native-paper';
import { CodePushVersion, versioning } from '../../utils/versioning';

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
  sentryVersion: string;
}

class VersionBadge extends React.PureComponent<{}, State> {
  state: State = {
    codePushVersion: {
      local: null,
      pending: null,
      remote: null,
    },
    sentryVersion: '',
  };

  async componentDidMount() {
    const codePushVersion = await versioning.getCodePushVersion();
    const sentryVersion = await versioning.getSentryVersion();
    this.setState({ sentryVersion, codePushVersion });
  }

  render() {
    const { sentryVersion, codePushVersion } = this.state;
    const { pending, remote } = codePushVersion;
    const version = `${sentryVersion} ${Config.ENV_NAME}`;
    return (
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
    );
  }
}

export default VersionBadge;
