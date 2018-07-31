import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Checkbox, Paragraph, ProgressBar, TouchableRipple } from 'react-native-paper';
import theme from '../../theme';

const styles = StyleSheet.create({
  label: {
    marginLeft: theme.margin.single,
  },
  row: {
    alignSelf: 'stretch',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.margin.single,
    paddingHorizontal: theme.margin.double,
  },
  progressContainer: {
    alignSelf: 'stretch',
    height: 48,
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
});

interface Props {
  label: string;
  disabled?: boolean;
  selected?: boolean;
  inProgress?: boolean;
  total?: number;
  downloaded?: number;
  onToggle?: (value: boolean) => void;
}

class OfflineCategory extends React.PureComponent<Props> {
  onPress = () => {
    if (this.props.onToggle) {
      this.props.onToggle(!this.props.selected);
    }
  };

  renderProgress = () => {
    const { label, total = 0, downloaded = 0 } = this.props;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Paragraph>{label}</Paragraph>
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
    const { label, inProgress, selected, disabled } = this.props;
    if (inProgress) {
      return this.renderProgress();
    }
    return (
      <TouchableRipple onPress={this.onPress} disabled={!!disabled}>
        <View style={styles.row}>
          <Checkbox
            checked={!!selected}
            disabled={!!disabled}
          />
          <Paragraph style={styles.label}>{label}</Paragraph>
        </View>
      </TouchableRipple>
    );
  }
}

export default OfflineCategory;
