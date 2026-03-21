import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMapSelection } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import theme from '~/theme';
import useLastNotNull from '~/utils/useLastNotNull';

import { NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';
import SelectedElementSheet from './SelectedElementSheet';
import SelectedPOIButtons from './SelectedPOIButtons';
import SelectedPOIHeader from './SelectedPOIHeader';
import useAndroidBackButton from './useAndroidBackButton';

const styles = StyleSheet.create({
  content: {
    minHeight:
      theme.rowHeight * 3 + (initialWindowMetrics?.insets?.bottom || 0),
    backgroundColor: theme.colors.primaryBackground,
    padding: theme.margin.single,
  },
});

const INSET =
  Platform.OS === 'ios' ? initialWindowMetrics?.insets.bottom ?? 0 : 0;
const SNAP_POINTS: [number, number] = [
  NAVIGATE_BUTTON_HEIGHT + INSET,
  NAVIGATE_BUTTON_HEIGHT + theme.rowHeight * 3 + INSET,
];

export const SelectedPOISheet = memo(() => {
  const [selection, onSelected] = useMapSelection();
  const poi = selection?.__typename === 'Point' ? selection : null;
  // Keep section as state to prevent flash of empty content before panel hides
  const lastPoi = useLastNotNull(poi);

  // Close sheet on android back button press
  useAndroidBackButton();

  return (
    <SelectedElementSheet
      selectionType="Point"
      snapPoints={SNAP_POINTS}
      Header={<SelectedPOIHeader poi={lastPoi} />}
      Buttons={<SelectedPOIButtons poi={lastPoi} />}
      selection={poi}
      onSelected={onSelected}
    >
      <BottomSheetScrollView style={styles.content}>
        <Paragraph>{lastPoi ? lastPoi.description : ''}</Paragraph>
      </BottomSheetScrollView>
    </SelectedElementSheet>
  );
});

SelectedPOISheet.displayName = 'SelectedPOISheet';
