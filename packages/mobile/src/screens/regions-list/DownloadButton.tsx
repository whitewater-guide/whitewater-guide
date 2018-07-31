import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from '../../components';
import theme from '../../theme';

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    justifyContent: 'flex-start',
    paddingTop: theme.margin.half,
    top: 0,
    right: 0,
    width: 48,
    height: 40,
    ...theme.shadow,
  },
});

interface Props {
  onPress: () => void;
}

export default class DownloadButton extends React.PureComponent<Props> {
  render() {
    return (
      <Icon
        icon="cloud-download"
        style={styles.icon}
        color={theme.colors.textLight}
        onPress={this.props.onPress}
      />
    );
  }
}
