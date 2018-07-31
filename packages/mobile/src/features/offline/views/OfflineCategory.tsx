import byteSize from 'byte-size';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Checkbox, Paragraph, ProgressBar, TouchableRipple } from 'react-native-paper';
import theme from '../../../theme';
import { OfflineCategoryType } from '../types';

const styles = StyleSheet.create({
  label: {
    marginLeft: theme.margin.single,
  },
  row: {
    alignSelf: 'stretch',
    height: theme.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    alignSelf: 'stretch',
    height: theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: theme.margin.half,
    paddingHorizontal: theme.margin.single,
  },
  progressHeader: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    alignSelf: 'stretch',
  },
  unavailable: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
});

interface Props {
  type: OfflineCategoryType;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  inProgress?: boolean;
  progress?: [number, number];
  onToggle?: (type: OfflineCategoryType, value: boolean) => void;
  unavailable?: boolean;
  size?: number;
}

class OfflineCategory extends React.PureComponent<Props> {
  getLabel = () =>
    this.props.size ? `${this.props.label} (${byteSize(this.props.size)})` : this.props.label;

  onPress = () => {
    if (this.props.onToggle) {
      this.props.onToggle(this.props.type, !this.props.selected);
    }
  };

  renderProgress = () => {
    const { progress} = this.props;
    if (!progress) {
      return (
        <View style={styles.progressContainer} />
      );
    }
    const [downloaded, total] = progress;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Paragraph>{this.getLabel()}</Paragraph>
          <Caption>{`${downloaded}/${total}`}</Caption>
        </View>
        <ProgressBar
          style={styles.progressBar}
          progress={total === 0 ? 0 : downloaded / total}
        />
      </View>
    );
  };

  render() {
    const { inProgress, selected, disabled, unavailable } = this.props;
    if (inProgress) {
      return this.renderProgress();
    }
    return (
      <TouchableRipple onPress={this.onPress} disabled={!!disabled}>
        <View style={styles.row}>
          <Checkbox checked={!!selected} color={theme.colors.primary} />
          <Paragraph style={[styles.label, unavailable && styles.unavailable]}>
            {this.getLabel()}
          </Paragraph>
        </View>
      </TouchableRipple>
    );
  }
}

export default OfflineCategory;
