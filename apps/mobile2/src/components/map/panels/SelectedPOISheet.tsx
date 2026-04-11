import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMapSelection } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import theme from '../../../theme';
import useLastNotNull from '../../../utils/useLastNotNull';
import { NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';
import SelectedElementSheet from './SelectedElementSheet';
import SelectedPOIButtons from './SelectedPOIButtons';
import SelectedPOIHeader from './SelectedPOIHeader';
import useAndroidBackButton from './useAndroidBackButton';

const INSET =
  Platform.OS === 'ios'
    ? (initialWindowMetrics?.insets.bottom ?? 0)
    : (initialWindowMetrics?.insets.bottom ?? 0) + 8;

const styles = StyleSheet.create({
  content: {
    minHeight: theme.rowHeight * 3,
    backgroundColor: theme.colors.primaryBackground,
    padding: theme.margin.single,
  },
});

export const SelectedPOISheet = memo(() => {
  const [selection, onSelected] = useMapSelection();
  const poi = selection?.__typename === 'Point' ? selection : null;
  const lastPoi = useLastNotNull(poi);
  const tabBarHeight = useBottomTabBarHeight();

  useAndroidBackButton();

  const snapPoints: [number, number] = [
    tabBarHeight + INSET,
    INSET + NAVIGATE_BUTTON_HEIGHT + theme.rowHeight * 3,
  ];

  return (
    <SelectedElementSheet
      selectionType="Point"
      snapPoints={snapPoints}
      Header={<SelectedPOIHeader poi={lastPoi} />}
      Buttons={<SelectedPOIButtons poi={lastPoi} />}
      selection={poi}
      onSelected={onSelected}
    >
      <BottomSheetScrollView style={styles.content}>
        <Text variant="bodyMedium">{lastPoi ? lastPoi.description : ''}</Text>
      </BottomSheetScrollView>
    </SelectedElementSheet>
  );
});

SelectedPOISheet.displayName = 'SelectedPOISheet';
