import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from '../../components';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: 0,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  loadingContainer: {
    paddingTop: theme.margin.single,
  },
  icon: {
    ...theme.shadow,
  },
  iconDisabled: {
    opacity: 0.85,
  },
});

interface Props {
  onPress: () => void;
  disabled?: boolean;
  inProgress?: boolean;
}

export default class DownloadButton extends React.PureComponent<Props> {
  renderInProgress = () => (
    <TouchableWithoutFeedback onPress={this.props.onPress}>
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator color={theme.colors.textLight} size="small" />
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    const { inProgress, disabled, onPress } = this.props;
    if (inProgress) {
      return this.renderInProgress();
    }
    return (
      <Icon
        icon="cloud-download"
        style={[styles.container, styles.iconContainer]}
        iconStyle={[styles.icon, disabled && styles.iconDisabled]}
        color={theme.colors.textLight}
        onPress={disabled ? undefined : onPress}
      />
    );
  }
}
