import { RegionMediaSummary } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../../../theme';
import {
  OfflineCategorySelection,
  OfflineCategoryType,
  OfflineProgress,
} from '../../types';
import CategoriesProgress from './CategoriesProgress';
import CategoriesSelection from './CategoriesSelection';

const styles = StyleSheet.create({
  categoriesContainer: {
    height: 3 * theme.rowHeight,
  },
});

interface Props {
  selection: OfflineCategorySelection;
  inProgress?: boolean;
  progress: OfflineProgress;
  summary: RegionMediaSummary;
  onToggleCategory?: (type: OfflineCategoryType, value: boolean) => void;
}

export const Categories: React.FC<Props> = (props) => {
  const { inProgress, progress, selection, summary, onToggleCategory } = props;
  return (
    <View style={styles.categoriesContainer}>
      {inProgress ? (
        <CategoriesProgress progress={progress} summary={summary} />
      ) : (
        <CategoriesSelection
          summary={summary}
          selection={selection}
          onToggleCategory={onToggleCategory}
        />
      )}
    </View>
  );
};
