import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Paragraph, ProgressBar } from 'react-native-paper';
import theme from '../../../../theme';

const styles = StyleSheet.create({
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
});

interface Props {
  progress?: [number, number];
  label: string;
}

const OfflineCategoryProgress: React.FC<Props> = React.memo(
  ({ progress, label }) => {
    const [downloaded, total] = progress || [0, 0];
    if (!progress) {
      return null;
    }
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
  },
);

OfflineCategoryProgress.displayName = 'OfflineCategoryProgress';

export default OfflineCategoryProgress;
