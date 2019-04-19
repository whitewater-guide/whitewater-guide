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

class VersionBadge extends React.PureComponent<{}, CodePushVersion> {
  state: CodePushVersion = {
    local: null,
    pending: null,
    remote: null,
  };

  async componentDidMount() {
    const version = await versioning.getCodePushVersion();
    this.setState(version);
  }

  render() {
    const { local, pending, remote } = this.state;
    const jsVersion = versioning.getJsVersion();
    const version = `${jsVersion}${local || 'v0'} ${Config.ENV_NAME}`;
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
