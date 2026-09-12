import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { NAVIGATE_BUTTON_HEIGHT } from '@/components/navigate-button';
import { BottomTabInset, RowHeight, Spacing } from '@/constants/theme';
import { useLastNotNull } from '@/hooks/use-last-not-null';
import { useTheme } from '@/hooks/use-theme';

import { useMapSelection } from '../map-selection';
import SelectedElementSheet from './selected-element-sheet';
import SelectedPOIButtons from './selected-poi-buttons';
import SelectedPOIHeader from './selected-poi-header';
import { useAndroidBackButton } from './use-android-back-button';

export const SelectedPOISheet = memo(() => {
  const theme = useTheme();
  const [selection, onSelected] = useMapSelection();
  const poi = selection?.__typename === 'Point' ? selection : null;
  const lastPoi = useLastNotNull(poi);
  const insets = useSafeAreaInsets();
  const safeBottom = insets.bottom + (Platform.OS === 'android' ? 8 : 0);

  useAndroidBackButton();

  const snapPoints: [number, number] = [
    BottomTabInset + safeBottom,
    safeBottom + NAVIGATE_BUTTON_HEIGHT + RowHeight * 3,
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
      <BottomSheetScrollView
        style={[
          styles.content,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <ThemedText type="small">{lastPoi ? lastPoi.description : ''}</ThemedText>
      </BottomSheetScrollView>
    </SelectedElementSheet>
  );
});

SelectedPOISheet.displayName = 'SelectedPOISheet';

const styles = StyleSheet.create({
  content: {
    minHeight: RowHeight * 3,
    padding: Spacing.two,
  },
});
